const Return = require('../models/Return');
const Order = require('../models/Order');

// @desc    Create a new return request
// @route   POST /api/returns
// @access  Private (Buyer)
exports.createReturn = async (req, res) => {
    try {
        const { orderId, productId, reason, comment, images } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Find the specific item in the order
        const orderItem = order.orderItems.find(item => item.product.toString() === productId);
        if (!orderItem) {
            return res.status(404).json({ message: 'Product not found in this order' });
        }

        const returnRequest = new Return({
            order: orderId,
            user: req.user._id,
            seller: orderItem.vendor,
            product: productId,
            orderItem: {
                name: orderItem.name,
                qty: orderItem.qty,
                price: orderItem.price,
                image: orderItem.image
            },
            reason,
            comment,
            images: images || []
        });

        const createdReturn = await returnRequest.save();
        res.status(201).json(createdReturn);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get returns for a seller
// @route   GET /api/returns/seller
// @access  Private (Seller)
exports.getSellerReturns = async (req, res) => {
    try {
        const returns = await Return.find({ seller: req.user._id })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(returns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update return status (Approve/Reject)
// @route   PUT /api/returns/:id/status
// @access  Private (Seller)
exports.updateReturnStatus = async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        const returnReq = await Return.findById(req.params.id);

        if (!returnReq) {
            return res.status(404).json({ message: 'Return request not found' });
        }

        if (returnReq.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        returnReq.status = status;
        if (adminNote) returnReq.adminNote = adminNote;

        const updatedReturn = await returnReq.save();

        // IF APPROVED: Update Order Item Status
        if (status === 'Approved') {
            const order = await Order.findById(returnReq.order);
            if (order) {
                // Find item by ID logic if available, or fallback to product ID + matching vendor
                // returnReq.orderItem is a snapshot, so we rely on product ID
                const itemIndex = order.orderItems.findIndex(i =>
                    i.product.toString() === returnReq.product.toString() &&
                    i.vendor.toString() === returnReq.seller.toString()
                );

                if (itemIndex !== -1) {
                    order.orderItems[itemIndex].status = 'Returned';
                    order.orderItems[itemIndex].payoutStatus = 'cancelled'; // Ensure not paid out

                    // Update Master Status
                    if (order.updateMasterStatus) {
                        order.updateMasterStatus();
                    }

                    await order.save();
                }
            }
        }

        res.json(updatedReturn);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
