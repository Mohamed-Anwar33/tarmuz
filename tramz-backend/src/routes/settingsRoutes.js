const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const settingsController = require('../controllers/settingsController');

// Get current contact recipient email
router.get('/contact-recipient', protect, admin, settingsController.getContactRecipient);

// Update contact recipient email
router.put('/contact-recipient', protect, admin, settingsController.updateContactRecipient);

module.exports = router;
