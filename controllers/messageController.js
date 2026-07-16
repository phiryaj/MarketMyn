const Message = require('../models/Message');
const User = require('../models/User');

// --- Helper: Redaction ---
const redactContent = (text) => {
    if (!text) return '';

    // Email Regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

    // Phone Regex (Generic 10 digit, or separated)
    // Matches: 082 123 4567, 082-123-4567, +27821234567, 0821234567
    const phoneRegex = /\b(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})\b/g;

    let redacted = text.replace(emailRegex, '[EMAIL REDACTED]');
    redacted = redacted.replace(phoneRegex, '[PHONE REDACTED]');

    return redacted;
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, content, orderId } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Message content required' });
        }

        const sanitizedContent = redactContent(content);

        const message = new Message({
            sender: req.user._id,
            receiver: receiverId,
            content: sanitizedContent,
            order: orderId
        });

        const createdMessage = await message.save();

        // Populate sender for immediate UI update
        await createdMessage.populate('sender', 'name email');
        await createdMessage.populate('receiver', 'name email');

        res.status(201).json(createdMessage);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get conversations (Grouped by User) - For Seller/Buyer Inbox
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { receiver: currentUserId }]
        })
            .sort({ createdAt: -1 })
            .populate('sender', 'name email')
            .populate('receiver', 'name email');

        // Group by the "other" person
        const conversations = {};

        messages.forEach(msg => {
            const isSender = msg.sender._id.toString() === currentUserId.toString();
            const otherUser = isSender ? msg.receiver : msg.sender;
            const otherId = otherUser._id.toString();

            if (!conversations[otherId]) {
                conversations[otherId] = {
                    user: {
                        _id: otherId,
                        name: otherUser.name,
                        email: otherUser.email // Maybe hide email here too?
                    },
                    lastMessage: msg.content,
                    date: msg.createdAt,
                    unreadCount: 0
                };
            }

            if (!isSender && !msg.isRead) {
                conversations[otherId].unreadCount++;
            }
        });

        // Convert to array
        const conversationList = Object.values(conversations).sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(conversationList);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get messages with specific user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const otherUserId = req.params.userId;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        })
            .sort({ createdAt: 1 }) // Oldest first for chat history
            .populate('sender', 'name')
            .populate('receiver', 'name');

        // Mark as read
        await Message.updateMany(
            { sender: otherUserId, receiver: currentUserId, isRead: false },
            { isRead: true }
        );

        res.json(messages);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
