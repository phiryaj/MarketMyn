const mongoose = require('mongoose');

const payoutSchema = mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    requestID: { type: String, unique: true }, // Auto-generated e.g., PAY-123
    amount: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    netAmount: { type: Number, required: true }, // Verified payout amount
    status: {
        type: String,
        enum: ['pending', 'approved', 'paid', 'rejected', 'on_hold'],
        default: 'pending'
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    paymentDetails: {
        bankName: String,
        accountNumber: String,
        reference: String
    },
    adminNotes: String,
    requestDate: { type: Date, default: Date.now },
    processedDate: Date,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payout', payoutSchema);
