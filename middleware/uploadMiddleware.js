const multer = require('multer');
const path = require('path');

// Use memoryStorage — required for Vercel (serverless, no disk writes allowed)
// File buffer is available as req.file.buffer or req.files[field][0].buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept images and PDFs
    const filetypes = /jpeg|jpg|png|webp|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images and PDFs only (jpg, jpeg, png, webp, pdf)'));
    }
};

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter,
});

module.exports = upload;
