const Promotion = require('../models/Promotion');
const Product = require('../models/Product');

// @desc    Create a new promotion
// @route   POST /api/promotions
// @access  Private (Seller)
exports.createPromotion = async (req, res) => {
    try {
        const { title, description, bannerImage, discountType, discountValue, startDate, endDate, products } = req.body;

        const promotion = new Promotion({
            title,
            description,
            bannerImage,
            discountType,
            discountValue,
            startDate,
            endDate,
            products: products || [],
            seller: req.user._id
        });

        const createdPromotion = await promotion.save();

        // Optionally update products to reflect they are on sale (complex logic, maybe just keep loose link)
        // For now, we rely on the Promotion to group them.

        res.status(201).json(createdPromotion);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get promotions for a seller
// @route   GET /api/promotions/seller
// @access  Private (Seller)
exports.getSellerPromotions = async (req, res) => {
    try {
        const promotions = await Promotion.find({ seller: req.user._id })
            .sort({ createdAt: -1 });
        res.json(promotions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get active promotions (Public for Home Page)
// @route   GET /api/promotions/active
// @access  Public
exports.getActivePromotions = async (req, res) => {
    try {
        const now = new Date();
        const promotions = await Promotion.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        }).sort({ endDate: 1 }); // Ending soonest first?

        res.json(promotions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single promotion details
// @route   GET /api/promotions/:id
// @access  Public
exports.getPromotionById = async (req, res) => {
    try {
        const promotion = await Promotion.findById(req.params.id)
            .populate('products'); // Populate specific products

        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }
        res.json(promotion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
