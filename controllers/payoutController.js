const Payout = require('../models/Payout');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Request a payout
// @route   POST /api/payouts
// @access  Private/Seller
// @desc    Get seller balance
// @route   GET /api/payouts/balance
// @access  Private/Seller
const getBalance = async (req, res) => {
    try {
        const orders = await Order.find({ 'orderItems.vendor': req.user.id });

        let balance = 0;
        orders.forEach(order => {
            order.orderItems.forEach(item => {
                if (item.vendor.toString() === req.user.id &&
                    item.payoutStatus === 'unpaid' &&
                    item.status !== 'Returned' &&
                    item.status !== 'Cancelled') {
                    balance += (item.price * item.qty);
                }
            });
        });

        res.json({ balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Request a payout
// @route   POST /api/payouts
// @access  Private/Seller
const requestPayout = async (req, res) => {
    try {
        // 1. Verify Bank Details
        const seller = await User.findById(req.user.id);
        if (!seller.bankDetails || !seller.bankDetails.isVerified) {
            // For MVP allowing unverified if we just saved them, but in prod block it.
            // checking simple existence for now
            if (!seller.bankDetails || !seller.bankDetails.accountNumber) {
                return res.status(400).json({ message: 'Please add bank details in Settings first.' });
            }
        }

        // 2. Calculate Amount & Identify Items
        const orders = await Order.find({
            'orderItems.vendor': req.user.id,
            'deliveryStatus': { $in: ['delivered', 'received'] }
        });

        let totalAmount = 0;
        let eligibleOrderIds = []; // To track which orders were touched (for reference)
        let commissionRate = seller.commissionRate || 0.10; // Default 10%

        // We need to update the order items.
        // Mongoose doesn't easily let us update nested arrays in bulk for multiple docs with different filters safely in one go without loops or hefty queries.
        // We will loop through found orders, identifying items, and updating them.

        const bulkUpdates = [];

        for (const order of orders) {
            let orderModified = false;
            order.orderItems.forEach(item => {
                // EXCLUDE 'Returned', 'Cancelled' statuses
                if (item.vendor.toString() === req.user.id &&
                    item.payoutStatus === 'unpaid' &&
                    item.status !== 'Returned' &&
                    item.status !== 'Cancelled') {

                    totalAmount += (item.price * item.qty);
                    item.payoutStatus = 'requested';
                    orderModified = true;
                }
            });

            if (orderModified) {
                eligibleOrderIds.push(order._id);
                bulkUpdates.push(order.save());
            }
        }

        if (totalAmount === 0) {
            return res.status(400).json({ message: 'No available balance to withdraw.' });
        }

        await Promise.all(bulkUpdates);

        // 3. Create Payout Record
        const payout = new Payout({
            seller: req.user.id,
            amount: totalAmount,
            commission: totalAmount * commissionRate,
            netAmount: totalAmount - (totalAmount * commissionRate),
            status: 'pending',
            orders: eligibleOrderIds,
            requestID: 'PAY-' + Date.now().toString().slice(-6),
            paymentDetails: {
                bankName: seller.bankDetails.bankName,
                accountNumber: seller.bankDetails.accountNumber
            }
        });

        const createdPayout = await payout.save();
        res.status(201).json(createdPayout);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all payouts
// @route   GET /api/payouts
// @access  Private/Admin/Seller
const getPayouts = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'seller') {
            query = { seller: req.user.id };
        }

        const payouts = await Payout.find(query)
            .populate('seller', 'name storeName email')
            .sort({ createdAt: -1 });

        res.json(payouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update payout status
// @route   PUT /api/payouts/:id
// @access  Private/Admin
// @desc    Update payout status
// @route   PUT /api/payouts/:id
// @access  Private/Admin
const updatePayoutStatus = async (req, res) => {
    try {
        const payout = await Payout.findById(req.params.id);

        if (payout) {
            payout.status = req.body.status || payout.status;
            payout.adminNotes = req.body.adminNotes || payout.adminNotes;

            if (req.body.status === 'paid') {
                payout.processedDate = Date.now();
                payout.processedBy = req.user.id;

                // Optional: Send notification to seller?
                // await notifySeller(payout.seller, 'Payout Processed');
            } else if (req.body.status === 'rejected') {
                // If rejected, we should probably revert the order items status to 'unpaid' so they can request again?
                // Or keep them 'requested' but in a failed payout state?
                // For simplicity, let's reset them to 'unpaid' so seller can try again or contact support.
                if (payout.orders && payout.orders.length > 0) {
                    await Order.updateMany(
                        { _id: { $in: payout.orders } },
                        { $set: { "orderItems.$[elem].payoutStatus": "unpaid" } },
                        { arrayFilters: [{ "elem.vendor": payout.seller }] }
                    );
                }
            }

            const updatedPayout = await payout.save();
            res.json(updatedPayout);
        } else {
            res.status(404).json({ message: 'Payout not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { requestPayout, getPayouts, updatePayoutStatus, getBalance };
