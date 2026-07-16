const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin', 'staff'],
        default: 'buyer'
    },

    // --- Staff / Admin Fields ---
    parentSeller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    permissions: [{ type: String }], // e.g. 'manage_products', 'manage_orders', 'view_analytics'
    adminRoles: [{
        type: String,
        enum: ['super_admin', 'admin', 'finance', 'support', 'content']
    }],
    lastLogin: { type: Date },

    // --- Seller Specific ---
    storeName: { type: String },
    legalEntityName: { type: String },
    businessAddress: { type: String },
    sellerType: { type: String, enum: ['individual', 'business'], default: 'individual' },
    idNumber: { type: String, unique: true, sparse: true },
    businessRegNumber: { type: String, unique: true, sparse: true },
    commissionRate: { type: Number },
    tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },

    bankDetails: {
        bankName: String,
        accountHolder: String,
        accountNumber: String,
        branchCode: String,
        type: { type: String, enum: ['personal', 'business'] },
        isVerified: { type: Boolean, default: false }
    },
    documents: {
        idDoc: String,
        bankProof: String,
        bizReg: String,
        directorIdDoc: String,
        isVerified: { type: Boolean, default: false }
    },
    metrics: {
        totalSales: { type: Number, default: 0 },
        orderCount: { type: Number, default: 0 },
        rating: { type: Number, default: 0 }
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    status: {
        type: String,
        enum: ['active', 'banned', 'pending', 'rejected'],
        default: 'active'
    },

    // --- Password Reset ---
    resetPasswordToken: { type: String },       // Hashed token stored in DB
    resetPasswordExpire: { type: Date },        // Expiry timestamp (15 min window)

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
