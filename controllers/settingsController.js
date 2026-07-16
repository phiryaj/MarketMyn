const Settings = require('../models/Settings');

// @desc    Get Platform Settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default if not exists
            settings = await Settings.create({});
        }
        res.json(settings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Platform Settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({});
        }

        settings.platformName = req.body.platformName || settings.platformName;
        settings.commissionDefault = req.body.commissionDefault ?? settings.commissionDefault;

        if (req.body.payoutSchedule) {
            settings.payoutSchedule.frequency = req.body.payoutSchedule.frequency || settings.payoutSchedule.frequency;
            settings.payoutSchedule.minThreshold = req.body.payoutSchedule.minThreshold ?? settings.payoutSchedule.minThreshold;
        }

        if (req.body.emailConfig) {
            settings.emailConfig = { ...settings.emailConfig, ...req.body.emailConfig };
        }

        const updatedSettings = await settings.save();
        res.json(updatedSettings);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
