const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        default: 0
    },
    onSale: {
        type: Boolean,
        default: false
    },
    shippingCost: {
        type: Number,
        default: 0
    },
    shippingCourier: {
        type: String,
        default: 'Standard Shipping'
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    images: [String],
    category: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vendorName: {
        type: String
    },
    numReviews: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
