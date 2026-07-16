const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        if (req.query.vendor) {
            keyword.vendor = req.query.vendor;
        }

        // Only show approved products to the public
        const products = await Product.find({ ...keyword, status: 'approved' });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = async (req, res) => {
    try {
        const { title, price, description, image, category, stock, sku } = req.body;

        const product = new Product({
            title,
            price,
            description,
            image: image || 'https://placehold.co/500x500/ff6b00/ffffff?text=No+Image',
            category: category || 'General',
            stock: stock || 100,
            sku: sku || '',
            vendor: req.user.id,
            vendorName: req.user.storeName || req.user.name || 'MarketMyn',
            images: image ? [image] : ['https://placehold.co/500x500/ff6b00/ffffff?text=No+Image'],
            // Admin-created products are auto-approved; seller products go through review
            status: req.user.role === 'admin' ? 'approved' : 'pending'
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Only the owning seller or an admin can delete
        if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        // Fix: use deleteOne() — product.remove() is deprecated in Mongoose 7+
        await product.deleteOne();
        res.json({ message: 'Product removed' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Only owning seller or admin can update
        if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }

        product.title       = req.body.title       || product.title;
        product.price       = req.body.price       ?? product.price;
        product.description = req.body.description || product.description;
        product.image       = req.body.image       || product.image;
        product.category    = req.body.category    || product.category;
        product.stock       = req.body.stock       ?? product.stock;
        product.salePrice   = req.body.salePrice   ?? product.salePrice;
        product.onSale      = req.body.onSale      ?? product.onSale;

        if (req.body.images && Array.isArray(req.body.images)) {
            product.images = req.body.images;
        }

        // Only admin can change product status (approve/reject)
        if (req.body.status && req.user.role === 'admin') {
            product.status = req.body.status;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct, updateProduct };
