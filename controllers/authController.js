const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const generateToken = (id, role) => {
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET env variable is not set');
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
    try {
        const {
            name, email, password, role, storeName, sellerType,
            idNumber, businessRegNumber, bankName, accountHolder,
            accountNumber, branchCode
        } = req.body;

        console.log('Register Request:', { email, role, sellerType });

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // 2. Strict uniqueness checks for sellers
        if (role === 'seller') {
            if (idNumber) {
                const idExists = await User.findOne({ idNumber });
                if (idExists) return res.status(400).json({ message: 'ID Number already registered' });
            }
            if (businessRegNumber) {
                const bizExists = await User.findOne({ businessRegNumber });
                if (bizExists) return res.status(400).json({ message: 'Business Registration Number already registered' });
            }
        }

        // 3. Handle file uploads — upload buffers to Cloudinary (Vercel compatible)
        const documents = {};
        if (req.files) {
            const docFields = ['idDoc', 'bankProof', 'bizReg', 'directorIdDoc'];
            for (const field of docFields) {
                if (req.files[field] && req.files[field][0]) {
                    try {
                        const result = await uploadToCloudinary(
                            req.files[field][0].buffer,
                            'marketmyn/documents'
                        );
                        documents[field] = result.secure_url;
                    } catch (uploadErr) {
                        console.error(`[Upload] Failed to upload ${field}:`, uploadErr.message);
                        documents[field] = null; // Don't crash registration if upload fails
                    }
                }
            }
        }

        // 4. Hash password and create user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            role: role || 'buyer',
        };

        if (role === 'seller') {
            userData.storeName = storeName;
            userData.sellerType = sellerType;
            userData.status = 'pending';
            userData.idNumber = idNumber;
            userData.businessRegNumber = businessRegNumber;
            userData.bankDetails = {
                bankName,
                accountHolder,
                accountNumber,
                branchCode,
                type: sellerType === 'business' ? 'business' : 'personal',
                isVerified: false
            };
            userData.documents = { ...documents, isVerified: false };
        }

        const user = await User.create(userData);

        if (user) {
            console.log('User created:', user._id);
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                storeName: user.storeName,
                status: user.status,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Block pending/banned sellers
            if (user.role === 'seller' && user.status !== 'active') {
                return res.status(403).json({
                    message: `Account is ${user.status}. ${user.status === 'pending' ? 'Please wait for admin approval.' : 'Please contact support.'}`
                });
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                storeName: user.storeName,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login. Please try again.' });
    }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        // Security: always return the same message to avoid email enumeration
        const successMsg = 'If an account with that email exists, a reset link has been sent. Check your inbox.';

        if (!user) {
            return res.json({ message: successMsg });
        }

        // Generate a raw random token (sent in email URL)
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the token before saving to DB
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Expire in 15 minutes
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        await user.save();

        // Build the reset URL — raw token in the link, hashed version in DB
        const siteUrl = process.env.SITE_URL || 'http://localhost:5000';
        const resetUrl = `${siteUrl}/forgot-password.html?token=${resetToken}&uid=${user._id}`;

        const emailSent = await sendEmail({
            email: user.email,
            subject: 'MarketMyn — Password Reset Request',
            message: `Hi ${user.name},\n\nYou requested to reset your MarketMyn password.\n\nClick the link below to set a new password (valid for 15 minutes):\n\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email — your password will not change.`,
            html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <div style="background:linear-gradient(135deg,#ff6b00,#ff8534);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
                <h1 style="color:#fff;margin:0;font-size:28px;">Market<span style="font-weight:900;">Myn</span></h1>
              </div>
              <div style="background:#fafafa;padding:30px;border:1px solid #eee;border-top:none;">
                <h2 style="color:#2c3e50;margin-top:0;">Password Reset Request</h2>
                <p style="color:#555;line-height:1.7;">Hi <strong>${user.name}</strong>,</p>
                <p style="color:#555;line-height:1.7;">We received a request to reset your password. Click the button below to set a new one. This link is valid for <strong>15 minutes</strong>.</p>
                <div style="text-align:center;margin:30px 0;">
                  <a href="${resetUrl}" style="background:#ff6b00;color:#fff;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">Reset My Password</a>
                </div>
                <p style="color:#888;font-size:13px;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${resetUrl}" style="color:#ff6b00;word-break:break-all;">${resetUrl}</a></p>
                <hr style="border:none;border-top:1px solid #eee;margin:20px 0;">
                <p style="color:#aaa;font-size:12px;">If you did not request a password reset, please ignore this email. Your account is safe.</p>
              </div>
              <div style="text-align:center;padding:15px;color:#ccc;font-size:12px;">
                © ${new Date().getFullYear()} MarketMyn. All rights reserved.
              </div>
            </div>`
        });

        if (!emailSent) {
            console.warn('[ForgotPassword] Email not sent — check EMAIL_* env vars');
        }

        res.json({ message: successMsg });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { userId, password } = req.body;

        if (!token || !userId || !password) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters.' });
        }

        // Hash the token from URL to compare with the stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with matching token AND non-expired expiry
        const user = await User.findOne({
            _id: userId,
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset link. Please request a new one.'
            });
        }

        // Set new hashed password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear the reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        // Send confirmation email
        await sendEmail({
            email: user.email,
            subject: 'MarketMyn — Password Changed Successfully',
            message: `Hi ${user.name},\n\nYour MarketMyn password has been changed successfully.\n\nIf you did not make this change, contact support immediately at ${process.env.EMAIL_USER || 'support@marketmyn.co.za'}.`
        });

        res.json({ message: 'Password reset successful! You can now log in with your new password.' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
