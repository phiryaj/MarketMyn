const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get seller profile
// @route   GET /api/seller/profile
// @access  Private/Seller
const getSellerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                storeName: user.storeName,
                legalEntityName: user.legalEntityName,
                businessAddress: user.businessAddress,
                businessRegNumber: user.businessRegNumber,
                phone: user.phone, // Assuming phone field exists or will be added
                bankDetails: user.bankDetails,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update seller profile
// @route   PUT /api/seller/profile
// @access  Private/Seller
const updateSellerProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.storeName = req.body.storeName || user.storeName;
            user.legalEntityName = req.body.legalEntityName || user.legalEntityName;
            user.businessAddress = req.body.businessAddress || user.businessAddress;
            user.businessRegNumber = req.body.businessRegNumber || user.businessRegNumber;
            // user.phone = req.body.phone || user.phone; // Add to model if missing

            // Update Bank Details if provided
            if (req.body.bankDetails) {
                user.bankDetails = {
                    bankName: req.body.bankDetails.bankName || user.bankDetails?.bankName,
                    accountHolder: req.body.bankDetails.accountHolder || user.bankDetails?.accountHolder,
                    accountNumber: req.body.bankDetails.accountNumber || user.bankDetails?.accountNumber,
                    branchCode: req.body.bankDetails.branchCode || user.bankDetails?.branchCode,
                    isVerified: false // Always reset verification on change
                };
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                storeName: updatedUser.storeName,
                bankDetails: updatedUser.bankDetails,
                token: req.headers.authorization.split(' ')[1] // Return checks out
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all sellers (Admin)
// @route   GET /api/seller/all
// @access  Private/Admin
const getSellers = async (req, res) => {
    try {
        const sellers = await User.find({ role: 'seller' }).select('-password');
        res.json(sellers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify Seller Documents
// @route   PUT /api/seller/verify/:id
// @access  Private/Admin
const verifySeller = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.status = req.body.status || user.status; // 'active', 'rejected'

            if (req.body.bankVerified !== undefined) {
                user.bankDetails.isVerified = req.body.bankVerified;
            }
            if (req.body.docsVerified !== undefined) {
                user.documents.isVerified = req.body.docsVerified;
            }

            // If everything verified, active
            if (user.bankDetails.isVerified && user.documents.isVerified) {
                user.status = 'active';
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get seller dashboard stats
// @route   GET /api/seller/stats
// @access  Private/Seller
const getSellerStats = async (req, res) => {
    try {
        const sellerId = req.user.id;

        // 1. Product Count
        const productCount = await Product.countDocuments({ vendor: sellerId });

        // 2. Orders & Sales
        // Find all orders that contain items from this seller
        const orders = await Order.find({ 'orderItems.vendor': sellerId }).sort({ createdAt: -1 });

        let totalSales = 0;
        let pendingOrdersCount = 0;
        const recentOrders = [];

        orders.forEach(order => {
            // Calculate seller specific status from their items
            let sellerStatus = 'Processing';
            const sellerItemStatuses = [];
            let orderTotalForSeller = 0;

            order.orderItems.forEach(item => {
                if (item.vendor.toString() === sellerId) {
                    // Only count sales if order is not cancelled
                    if (order.status !== 'Cancelled') {
                        orderTotalForSeller += (item.price * item.qty);
                    }
                    sellerItemStatuses.push(item.status);
                }
            });

            if (sellerItemStatuses.length > 0) {
                const uniqueStatuses = [...new Set(sellerItemStatuses)];
                if (uniqueStatuses.length === 1 && uniqueStatuses[0] === 'Delivered') {
                    sellerStatus = 'Delivered';
                } else if (uniqueStatuses.every(s => ['Shipped', 'Delivered'].includes(s))) {
                    sellerStatus = 'Shipped';
                }
            }

            totalSales += orderTotalForSeller;

            // Check if order is pending/processing
            if (sellerStatus !== 'Delivered' && sellerStatus !== 'Cancelled' && sellerStatus !== 'Returned') {
                pendingOrdersCount++;
            }

            // Add to recent orders (simplify for frontend)
            if (recentOrders.length < 5) {
                recentOrders.push({
                    _id: order._id,
                    user: order.user,
                    totalPrice: orderTotalForSeller,
                    status: sellerStatus,
                    createdAt: order.createdAt
                });
            }
        });

        // 3. Populate User names for recent orders
        // We can do a quick populate or just let frontend ID handle it. 
        // Better to populate basic user info here to save frontend calls.
        if (recentOrders.length > 0) {
            await Order.populate(recentOrders, { path: 'user', select: 'name' });
        }

        res.json({
            sales: totalSales,
            orders: pendingOrdersCount,
            products: productCount,
            recentOrders
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get seller analytics (charts)
// @route   GET /api/seller/analytics
// @access  Private/Seller
const getSellerAnalytics = async (req, res) => {
    try {
        const sellerId = req.user.id;

        // 1. Weekly Revenue (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const orders = await Order.find({
            'orderItems.vendor': sellerId,
            createdAt: { $gte: sevenDaysAgo },
            status: { $ne: 'Cancelled' } // Basic filter
        });

        // Initialize last 7 days map
        const salesMap = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            salesMap[d.toISOString().split('T')[0]] = 0;
        }

        orders.forEach(order => {
            const dateStr = order.createdAt.toISOString().split('T')[0];
            if (salesMap[dateStr] !== undefined) {
                // Sum items for this seller
                order.orderItems.forEach(item => {
                    if (item.vendor.toString() === sellerId) {
                        salesMap[dateStr] += (item.price * item.qty);
                    }
                });
            }
        });

        // Convert to arrays for Chart.js
        // Chart usually wants labels left-to-right (oldest to newest)
        const labels = Object.keys(salesMap).reverse(); // ['2023-10-25', '2023-10-26'...]
        const data = Object.values(salesMap).reverse();

        // 2. Top Products (All Time) - Simplified
        // Real aggression might be better but let's do simple JS processing for MVP
        // Fetch all orders for deep analysis might be heavy, let's limit to last 100 for "Recent Top"
        const recentOrders = await Order.find({ 'orderItems.vendor': sellerId })
            .sort({ createdAt: -1 })
            .limit(100);

        const productStats = {};
        recentOrders.forEach(order => {
            order.orderItems.forEach(item => {
                if (item.vendor.toString() === sellerId) {
                    const pid = item.product.toString(); // or item.name
                    if (!productStats[item.name]) productStats[item.name] = 0;
                    productStats[item.name] += item.qty;
                }
            });
        });

        // Sort by qty
        const topProducts = Object.entries(productStats)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5) // Top 5
            .map(([name, qty]) => ({ name, qty }));

        res.json({
            weeklySales: { labels, data },
            topProducts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getSellerProfile, updateSellerProfile, getSellers, verifySeller, getSellerStats, getSellerAnalytics };
