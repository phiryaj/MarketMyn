const express = require('express');
const router = express.Router();
const { requestPayout, getPayouts, updatePayoutStatus, getBalance } = require('../controllers/payoutController');
const { protect, admin, seller } = require('../middleware/authMiddleware');

// Balance Route - Must be before /:id or specific param routes if any conflict, though here it's fine
router.get('/balance', protect, seller, getBalance);

router.route('/')
    .post(protect, seller, requestPayout)
    .get(protect, getPayouts);

router.route('/:id')
    .put(protect, admin, updatePayoutStatus);

module.exports = router;
