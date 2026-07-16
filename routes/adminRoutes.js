const express = require('express');
const router = express.Router();
const {
    getStats,
    getUsers,
    updateUserStatus,
    getAdminProducts,
    deleteProductAdmin,
    updateProductStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getStats);
router.get('/orders', protect, admin, require('../controllers/adminController').getAdminOrders);
router.get('/payouts/due', protect, admin, require('../controllers/adminController').getPayoutsDue);
router.get('/payouts/seller/:id', protect, admin, require('../controllers/adminController').getSellerPayoutDetails);
router.get('/sellers/pending', protect, admin, require('../controllers/adminController').getPendingSellers);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id', protect, admin, updateUserStatus);
router.get('/products', protect, admin, getAdminProducts);
router.put('/products/:id', protect, admin, updateProductStatus);
router.delete('/products/:id', protect, admin, deleteProductAdmin);

module.exports = router;
