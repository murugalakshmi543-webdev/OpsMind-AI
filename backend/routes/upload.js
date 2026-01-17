const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.post('/', uploadController.uploadDocument);
router.get('/', uploadController.getDocuments);
router.delete('/:id', uploadController.deleteDocument);

module.exports = router;