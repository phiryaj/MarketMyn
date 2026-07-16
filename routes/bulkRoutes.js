const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { importProducts, exportProducts } = require('../controllers/bulkController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/temp/' }); // Temp storage for parsing

router.post('/import', protect, upload.single('file'), importProducts);
router.get('/export', protect, exportProducts);

module.exports = router;
