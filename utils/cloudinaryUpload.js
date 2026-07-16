const cloudinary = require('cloudinary').v2;

// Configure Cloudinary only when credentials are available
if (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:    process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

/**
 * Upload a file buffer to Cloudinary.
 *
 * @param {Buffer} buffer     - File buffer from multer memoryStorage
 * @param {string} folder     - Cloudinary folder name (e.g. 'marketmyn/products')
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
const uploadToCloudinary = (buffer, folder = 'marketmyn') => {
    return new Promise((resolve, reject) => {
        // Graceful fallback when Cloudinary is not yet configured
        if (!process.env.CLOUDINARY_CLOUD_NAME) {
            console.warn('[Cloudinary] Not configured — returning placeholder. Set CLOUDINARY_* env vars to enable real uploads.');
            return resolve({
                secure_url: 'https://placehold.co/500x500/ff6b00/ffffff?text=Image+Pending',
                public_id: 'placeholder'
            });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',  // handles images AND PDFs
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'pdf'],
            },
            (error, result) => {
                if (error) {
                    console.error('[Cloudinary] Upload error:', error);
                    return reject(error);
                }
                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};

module.exports = { uploadToCloudinary };
