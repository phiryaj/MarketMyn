const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const { protect } = require('../middleware/authMiddleware');

// Memory storage — no disk writes (Vercel compatible)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowed = /jpg|jpeg|png|webp/;
        if (allowed.test(file.mimetype)) cb(null, true);
        else cb(new Error('Images only (jpg, jpeg, png, webp)'));
    }
});

// @route   POST /api/upload
// @desc    Upload single product image to Cloudinary
// @access  Private (seller/admin)
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await uploadToCloudinary(req.file.buffer, 'marketmyn/products');

        res.json({
            message: 'Image uploaded successfully',
            filePath: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        console.error('[Upload] Error:', error);
        res.status(500).json({ message: 'Upload failed: ' + error.message });
    }
});

module.exports = router;
