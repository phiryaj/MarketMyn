const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject: {
        type: String,
        required: true
    },
    topic: {
        type: String, // 'Order Issue', 'Payout Inquiry', etc.
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'resolved'],
        default: 'open'
    },
    replies: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Could be Admin or Seller
        senderRole: { type: String, enum: ['admin', 'seller', 'staff'] },
        message: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
