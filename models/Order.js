const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderItems: [{
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        payoutStatus: {
            type: String,
            enum: ['unpaid', 'requested', 'paid', 'cancelled'],
            default: 'unpaid'
        },
        status: {
            type: String,
            enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned', 'Partially Shipped'],
            default: 'Processing'
        },
        shippingDetails: {
            courier: String,
            trackingNumber: String,
            shippedAt: Date
        }
    }],
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    deliveredAt: {
        type: Date
    },
    // Enhanced Delivery Tracking
    deliveryStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'received', 'returned', 'failed'],
        default: 'pending'
    },
    shipment: {
        courier: String,
        trackingNumber: String,
        shippedAt: Date,
        estimatedDelivery: Date
    },
    // Buyer Confirmation (Releases Payout)
    buyerConfirmation: {
        confirmed: { type: Boolean, default: false },
        date: Date,
        method: String // 'manual', 'auto_7_days'
    },
    // Admin/System
    adminNotes: String,
}, {
    timestamps: true
});

orderSchema.methods.updateMasterStatus = function () {
    const allStatuses = this.orderItems.map(i => i.status);
    const uniqueStatuses = [...new Set(allStatuses)];

    if (uniqueStatuses.length === 1 && uniqueStatuses[0] === 'Delivered') {
        this.status = 'Delivered';
        this.deliveryStatus = 'delivered';
        this.isDelivered = true;
        this.deliveredAt = Date.now();
    } else if (uniqueStatuses.length === 1 && uniqueStatuses[0] === 'Shipped') {
        this.status = 'Shipped';
        this.deliveryStatus = 'shipped';
    } else if (allStatuses.every(s => ['Shipped', 'Delivered'].includes(s))) {
        this.status = 'Shipped'; // Or 'Partially Delivered' if you want
    } else if (allStatuses.some(s => ['Shipped', 'Delivered'].includes(s))) {
        this.status = 'Partially Shipped'; // New status for main order
    } else {
        // If we want to revert to Processing if things are cancelled/returned, handle here.
        // For now, if not all shipped, it's Processing (or stays as is).
        // Let's assume default is Processing.
    }

    return this.status;
};

module.exports = mongoose.model('Order', orderSchema);
