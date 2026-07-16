const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getConversations, getMessages } = require('../controllers/messageController');

router.route('/')
    .post(protect, sendMessage);

router.route('/conversations')
    .get(protect, getConversations);

router.route('/:userId')
    .get(protect, getMessages);

module.exports = router;
