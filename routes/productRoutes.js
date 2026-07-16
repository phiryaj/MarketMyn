const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const { protect, seller } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/:id')
    .get(getProductById)
    .delete(protect, seller, deleteProduct)
    .put(protect, seller, updateProduct); // Allow seller to update own, controller handles admin override check if needed, or we make middleware flexible

module.exports = router;
