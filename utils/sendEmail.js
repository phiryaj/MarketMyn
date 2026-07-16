const nodemailer = require('nodemailer');

/**
 * sendEmail — Sends a real email via SMTP (Gmail / any provider).
 *
 * Required .env variables:
 *   EMAIL_HOST     e.g. smtp.gmail.com
 *   EMAIL_PORT     e.g. 465
 *   EMAIL_USER     your email address
 *   EMAIL_PASS     your Gmail App Password (NOT your normal password)
 *   EMAIL_FROM     display name + address, e.g. "MakertMyn <no-reply@makertmyn.co.za>"
 *
 * Gmail App Password setup:
 *   1. Go to https://myaccount.google.com/security
 *   2. Enable 2-Factor Authentication
 *   3. Search "App Passwords" → Generate one for "Mail"
 *   4. Paste the 16-char password into EMAIL_PASS in .env
 */
const sendEmail = async (options) => {
    // Validate config exists
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('[sendEmail] EMAIL_USER / EMAIL_PASS not set in .env — email not sent.');
        console.log(`[sendEmail] Would have sent to: ${options.email} | Subject: ${options.subject}`);
        return false;
    }

    const transporter = nodemailer.createTransport({
        host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
        port:   parseInt(process.env.EMAIL_PORT || '465'),
        secure: parseInt(process.env.EMAIL_PORT || '465') === 465, // true for 465, false for 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from:    process.env.EMAIL_FROM || `"MakertMyn" <${process.env.EMAIL_USER}>`,
        to:      options.email,
        subject: options.subject,
        text:    options.message,
        // Optional HTML version — fallback to plain text
        html: options.html || `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px;border:1px solid #eee;border-radius:12px;">
            <div style="background:#ff6b00;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
                <h1 style="color:#fff;margin:0;font-size:24px;">MakertMyn</h1>
            </div>
            <div style="padding:30px;background:#fafafa;">
                <p style="font-size:15px;color:#333;line-height:1.7;white-space:pre-line;">${options.message}</p>
            </div>
            <div style="padding:15px;text-align:center;font-size:12px;color:#999;">
                &copy; ${new Date().getFullYear()} MakertMyn. All rights reserved.
            </div>
        </div>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[sendEmail] ✅ Email sent to ${options.email} — MessageId: ${info.messageId}`);
        return true;
    } catch (err) {
        console.error(`[sendEmail] ❌ Failed to send email to ${options.email}:`, err.message);
        // Don't crash the app if email fails — just warn
        return false;
    }
};

module.exports = sendEmail;
