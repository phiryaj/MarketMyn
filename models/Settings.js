const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    platformName: { type: String, default: 'MarketMyn' },
    commissionDefault: { type: Number, default: 10 }, // Percentage
    categoryCommissions: [{
        category: String,
        rate: Number
    }],
    payoutSchedule: {
        frequency: { type: String, enum: ['weekly', 'bi-weekly', 'monthly'], default: 'weekly' },
        minThreshold: { type: Number, default: 100 }
    },
    emailConfig: {
        senderEmail: String,
        smtpHost: String,
        smtpPort: Number
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
