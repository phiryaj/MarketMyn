const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const productsCount = await Product.countDocuments();
        const sellersCount = await User.countDocuments({ role: 'seller' });
        const pendingSellers = await User.countDocuments({ role: 'seller', status: 'pending' });

        // Total sales revenue
        const salesResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalPrice' },
                    count: { $sum: 1 }
                }
            }
        ]);
        const totalSales = salesResult.length > 0 ? salesResult[0].totalSales : 0;
        const totalOrders = salesResult.length > 0 ? salesResult[0].count : 0;

        // Pending payouts total
        const payoutsResult = await require('../models/Payout').aggregate([
            { $match: { status: 'pending' } },
            { $group: { _id: null, totalPending: { $sum: '$amount' } } }
        ]);
        const pendingPayouts = payoutsResult.length > 0 ? payoutsResult[0].totalPending : 0;

        const platformCommission = totalSales * 0.10;

        res.json({
            users: usersCount,
            products: productsCount,
            sellers: sellersCount,
            pendingSellers,
            revenue: totalSales,
            commission: platformCommission,
            pendingPayouts,
            totalOrders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update User Status (Ban/Approve/Reject)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const oldStatus = user.status;
        user.status = req.body.status || user.status;

        if (req.body.status === 'rejected' && req.body.reason) {
            console.log(`User ${user.email} rejected. Reason: ${req.body.reason}`);
        }

        const updatedUser = await user.save();

        // Send approval/rejection email
        const sendEmail = require('../utils/sendEmail');
        const siteUrl = process.env.SITE_URL || 'http://localhost:5000';

        if (req.body.status === 'active' && oldStatus !== 'active') {
            await sendEmail({
                email: user.email,
                subject: 'Congratulations — Seller Account Approved! | MarketMyn',
                message: `Congratulations ${user.name},\n\nYour seller account on MarketMyn has been approved! You can now log in and start selling.\n\nLogin here: ${siteUrl}/seller-auth.html\n\nWelcome to the MarketMyn family!`
            });
        } else if (req.body.status === 'rejected') {
            await sendEmail({
                email: user.email,
                subject: 'Seller Application Update | MarketMyn',
                message: `Dear ${user.name},\n\nThank you for applying to sell on MarketMyn. After reviewing your application, we were unable to approve it at this time.\n\nReason: ${req.body.reason || 'Documents did not meet our requirements.'}\n\nPlease contact our support team if you have any questions or would like to reapply.`
            });
        }

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Products (Admin View — all statuses)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAdminProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete Product (Admin)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProductAdmin = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Product Status (Approve/Reject)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProductStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        product.status = req.body.status || product.status;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Payouts Due (Sellers with positive balance)
// @route   GET /api/admin/payouts/due
// @access  Private/Admin
const getPayoutsDue = async (req, res) => {
    try {
        const platformSettings = await require('../models/Settings').findOne({});
        const commissionRate = (platformSettings?.commissionDefault || 10) / 100;

        const salesData = await Order.aggregate([
            { $match: { isPaid: true, deliveryStatus: 'delivered' } },
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.vendor',
                    totalSales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.qty'] } }
                }
            }
        ]);

        const payoutData = await require('../models/Payout').aggregate([
            { $match: { status: { $in: ['approved', 'paid'] } } },
            { $group: { _id: '$seller', totalPaid: { $sum: '$amount' } } }
        ]);

        const sellers = await User.find({ role: 'seller' }).select('name storeName email bankDetails');

        const dueList = sellers.map(seller => {
            const saleRec = salesData.find(s => s._id.toString() === seller._id.toString());
            const payRec  = payoutData.find(p => p._id.toString() === seller._id.toString());
            const totalSales = saleRec ? saleRec.totalSales : 0;
            const totalPaid  = payRec  ? payRec.totalPaid   : 0;
            const commission = totalSales * commissionRate;
            const netEarnings = totalSales - commission;
            const balanceDue  = netEarnings - totalPaid;

            return {
                sellerId: seller._id,
                name: seller.storeName || seller.name,
                email: seller.email,
                bank: seller.bankDetails,
                totalSales,
                commission,
                totalPaid,
                balanceDue
            };
        }).filter(item => item.balanceDue > 0);

        res.json(dueList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Seller Payout Details (Deep Dive)
// @route   GET /api/admin/payouts/seller/:id
// @access  Private/Admin
const getSellerPayoutDetails = async (req, res) => {
    try {
        const sellerId = req.params.id;
        const seller = await User.findById(sellerId).select('name storeName email bankDetails createdAt');
        if (!seller) return res.status(404).json({ message: 'Seller not found' });

        const orders = await Order.find({
            'orderItems.vendor': sellerId,
            isPaid: true
        }).populate('user', 'name').sort({ createdAt: -1 });

        const relevantOrders = orders.map(order => {
            const items = order.orderItems.filter(item => item.vendor.toString() === sellerId);
            const totalForSeller = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
            return {
                _id: order._id,
                date: order.createdAt,
                customer: order.user?.name || 'Guest',
                totalForSeller,
                deliveryStatus: order.deliveryStatus,
                items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price, image: i.image }))
            };
        });

        const tickets = await require('../models/Ticket').find({ seller: sellerId })
            .sort({ createdAt: -1 }).limit(10);

        res.json({ seller, orders: relevantOrders, tickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Pending Sellers
// @route   GET /api/admin/sellers/pending
// @access  Private/Admin
const getPendingSellers = async (req, res) => {
    try {
        const sellers = await User.find({ role: 'seller', status: 'pending' })
            .select('name storeName email createdAt documents bankDetails')
            .sort({ createdAt: -1 });
        res.json(sellers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getStats,
    getUsers,
    updateUserStatus,
    getAdminProducts,
    deleteProductAdmin,
    updateProductStatus,
    getPayoutsDue,
    getAdminOrders,
    getSellerPayoutDetails,
    getPendingSellers
};
