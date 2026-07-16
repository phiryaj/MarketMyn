const Ticket = require('../models/Ticket');

// @desc    Create a new ticket
// @route   POST /api/support
// @access  Private (Seller)
const createTicket = async (req, res) => {
    try {
        const { subject, topic, message } = req.body;

        const ticket = await Ticket.create({
            seller: req.user._id,
            subject,
            topic,
            message,
            status: 'open'
        });

        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user's tickets
// @route   GET /api/support
// @access  Private (Seller)
const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ seller: req.user._id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add reply to ticket
// @route   POST /api/support/:id/reply
// @access  Private (Admin/Seller)
const replyTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        // Check permission (Admin or Ticket Owner)
        if (req.user.role !== 'admin' && ticket.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const reply = {
            sender: req.user._id,
            senderRole: req.user.role,
            message: req.body.message
        };

        ticket.replies.push(reply);

        // If admin replies, maybe mark as resolved or actionable? Keeping simple for now.
        // If seller replies, maybe re-open if closed? 
        if (req.user.role === 'admin' && ticket.status === 'open') {
            // Optional logic
        }

        await ticket.save();
        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createTicket, getMyTickets, replyTicket };
