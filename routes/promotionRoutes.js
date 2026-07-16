const express = require('express');
const router = express.Router();
const { protect, seller } = require('../middleware/authMiddleware');
const { createPromotion, getSellerPromotions, getActivePromotions, getPromotionById } = require('../controllers/promotionController');

router.route('/')
    .post(protect, seller, createPromotion);

router.route('/seller')
    .get(protect, seller, getSellerPromotions);

router.route('/active')
    .get(getActivePromotions);

router.route('/:id')
    .get(getPromotionById);

module.exports = router;
