const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getStaff, createStaff, deleteStaff, updateStaff } = require('../controllers/staffController');

router.route('/')
    .get(protect, getStaff)
    .post(protect, createStaff);

router.route('/:id')
    .put(protect, updateStaff)
    .delete(protect, deleteStaff);

module.exports = router;
