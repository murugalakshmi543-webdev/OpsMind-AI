const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/query', chatController.queryDocuments);
router.get('/history', chatController.getChatHistory);

module.exports = router;