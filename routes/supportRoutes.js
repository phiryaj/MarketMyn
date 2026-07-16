const express = require('express');
const router = express.Router();
const { createTicket, getMyTickets, replyTicket } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createTicket).get(protect, getMyTickets);
router.route('/:id/reply').post(protect, replyTicket);

module.exports = router;
