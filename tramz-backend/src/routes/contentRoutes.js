const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', contentController.getAllContent);
router.get('/:type', contentController.getContent);

// Protected routes (require authentication)
router.post('/', protect, contentController.createContent);
router.put('/:type', protect, contentController.updateContent);
router.delete('/:id', protect, contentController.deleteContent);

module.exports = router;