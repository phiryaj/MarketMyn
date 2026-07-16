const mongoose = require('mongoose');

const returnSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    orderItem: {
        name: String,
        qty: Number,
        price: Number,
        image: String
    },
    reason: {
        type: String,
        required: true,
        enum: ['Damaged', 'Defective', 'Wrong Item', 'Missing Parts', 'Changed Mind', 'Other']
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Rejected', 'Refunded']
    },
    images: [{
        type: String // URLs to uploaded proof images
    }],
    adminNote: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Return', returnSchema);
