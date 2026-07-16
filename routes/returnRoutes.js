const express = require('express');
const router = express.Router();
const { protect, seller } = require('../middleware/authMiddleware');
const { createReturn, getSellerReturns, updateReturnStatus } = require('../controllers/returnController');

router.route('/')
    .post(protect, createReturn);

router.route('/seller')
    .get(protect, seller, getSellerReturns);

router.route('/:id/status')
    .put(protect, seller, updateReturnStatus);

module.exports = router;
