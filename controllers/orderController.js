const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    try {
        // Hydrate order items with vendor ID from the Product collection
        const enrichedOrderItems = await Promise.all(orderItems.map(async (item) => {
            const product = await Product.findById(item.product);
            if (!product) {
                throw new Error(`Product not found: ${item.product}`); // Will be caught below
            }
            return {
                ...item,
                vendor: product.vendor, // Attach vendor ID
                // Optionally verify price here for security
            };
        }));

        const order = new Order({
            user: req.user.id,
            orderItems: enrichedOrderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            status: 'Processing'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Helper to calculate seller-specific view of an order
const getSellerOrderContext = (order, sellerId) => {
    const orderObj = order.toObject ? order.toObject() : order;

    // Filter items for this seller
    orderObj.orderItems = orderObj.orderItems.filter(item =>
        item.vendor && item.vendor.toString() === sellerId
    );

    // Calculate seller specific total
    orderObj.sellerTotal = orderObj.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    // Calculate seller specific status
    if (orderObj.orderItems.length > 0) {
        const itemStatuses = orderObj.orderItems.map(i => i.status);
        const uniqueStatuses = [...new Set(itemStatuses)];

        if (uniqueStatuses.length === 1 && uniqueStatuses[0] === 'Delivered') {
            orderObj.status = 'Delivered';
        } else if (uniqueStatuses.every(s => s === 'Shipped' || s === 'Delivered')) {
            // If all items are shipped or delivered, show Shipped (unless all are Delivered, handled above)
            orderObj.status = 'Shipped';
        } else {
            // If any item is still Processing (or other non-completed status), show Processing
            orderObj.status = 'Processing';
        }
    }

    return orderObj;
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            const isOwner = order.user._id.toString() === req.user.id;
            const isAdmin = req.user.role === 'admin';
            const isSellerAndHasItems = req.user.role === 'seller' &&
                order.orderItems.some(i => i.vendor && i.vendor.toString() === req.user.id);

            if (isOwner || isAdmin || isSellerAndHasItems) {
                // If seller, filter items to show only theirs
                if (req.user.role === 'seller' && !isAdmin) {
                    const sellerOrder = getSellerOrderContext(order, req.user.id);
                    res.json(sellerOrder);
                } else {
                    res.json(order);
                }
            } else {
                res.status(401).json({ message: 'Not authorized' });
            }
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all orders (Seller/Admin)
// @route   GET /api/orders
// @access  Private/Seller/Admin
const getOrders = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'seller') {
            query = { 'orderItems.vendor': req.user.id };
        }

        let orders = await Order.find(query)
            .populate('user', 'id name email')
            .populate({
                path: 'orderItems.product',
                select: 'vendor vendorName'
            })
            .sort({ createdAt: -1 });

        // If seller, filter the actual items in the response so they only see theirs
        if (req.user.role === 'seller') {
            orders = orders.map(order => getSellerOrderContext(order, req.user.id));
        }

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Seller/Admin
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Seller/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            const sellerId = req.user.id;
            const isAdmin = req.user.role === 'admin';

            // 1. Identify items to update
            let itemsToUpdate = [];
            if (isAdmin) {
                // Admin updates everything (or could be specific, strictly enforcing master override)
                itemsToUpdate = order.orderItems;
            } else {
                // Seller updates only their items
                itemsToUpdate = order.orderItems.filter(item => item.vendor.toString() === sellerId);
            }

            if (itemsToUpdate.length === 0 && !isAdmin) {
                return res.status(403).json({ message: 'No items found for this seller in this order' });
            }

            // 2. Update status for those items
            itemsToUpdate.forEach(item => {
                item.status = req.body.status;
                if (req.body.status === 'Shipped') {
                    item.shippingDetails = {
                        courier: req.body.courier,
                        trackingNumber: req.body.trackingNumber,
                        shippedAt: Date.now()
                    };
                }
            });

            // 3. Recalculate Master Order Status
            order.updateMasterStatus();

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Buyer confirms order receipt
// @route   PUT /api/orders/:id/confirm
// @access  Private/Buyer
const confirmOrderReceipt = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ensure user is the buyer
        if (order.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (order.deliveryStatus !== 'delivered' && order.deliveryStatus !== 'shipped') {
            // Optional: Allow confirming even if strictly not marked delivered yet? 
            // Best practice: yes, because sometimes couriers are slow to update
        }

        order.deliveryStatus = 'received';
        order.buyerConfirmation = {
            confirmed: true,
            date: Date.now(),
            method: 'manual'
        };

        // This is where we would trigger Payout eligibility logic (e.g. queue a job)

        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { addOrderItems, getMyOrders, getOrderById, getOrders, updateOrderStatus, confirmOrderReceipt };
