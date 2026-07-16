const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all staff for current seller
// @route   GET /api/staff
// @access  Private/Seller
exports.getStaff = async (req, res) => {
    try {
        const staff = await User.find({ parentSeller: req.user.id }).select('-password');
        res.json(staff);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a staff member
// @route   POST /api/staff
// @access  Private/Seller
exports.createStaff = async (req, res) => {
    try {
        const { name, email, password, permissions } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'staff',
            storeName: req.user.storeName, // Inherit store name
            parentSeller: req.user.id,
            permissions: permissions || []
        });

        await user.save();

        res.status(201).json({ message: 'Staff created', staff: { id: user.id, name: user.name, email: user.email, permissions: user.permissions } });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private/Seller
exports.deleteStaff = async (req, res) => {
    try {
        const staff = await User.findById(req.params.id);

        if (!staff) return res.status(404).json({ message: 'Staff not found' });

        // Ensure this staff belongs to the requester
        if (staff.parentSeller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await staff.deleteOne();
        res.json({ message: 'Staff removed' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update staff permissions
// @route   PUT /api/staff/:id
// @access  Private/Seller
exports.updateStaff = async (req, res) => {
    try {
        const staff = await User.findById(req.params.id);

        if (!staff) return res.status(404).json({ message: 'Staff not found' });

        if (staff.parentSeller.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (req.body.permissions) staff.permissions = req.body.permissions;
        // Could also update name/email/password if needed

        await staff.save();
        res.json({ message: 'Staff updated', staff });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
