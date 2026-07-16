const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderStatus, confirmOrderReceipt } = require('../controllers/orderController');
const { protect, seller, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, seller, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, seller, updateOrderStatus);
router.route('/:id/confirm').put(protect, confirmOrderReceipt);

module.exports = router;
