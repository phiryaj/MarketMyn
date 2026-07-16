const express = require('express');
const router = express.Router();
const { getSellerProfile, updateSellerProfile, getSellers, verifySeller, getSellerStats, getSellerAnalytics } = require('../controllers/sellerController');
const { protect, seller, admin } = require('../middleware/authMiddleware');

router.route('/profile')
    .get(protect, seller, getSellerProfile)
    .put(protect, seller, updateSellerProfile);

router.get('/stats', protect, seller, getSellerStats);
router.get('/analytics', protect, seller, getSellerAnalytics);

// Admin Routes
router.get('/all', protect, admin, getSellers);
router.put('/verify/:id', protect, admin, verifySeller);

module.exports = router;
