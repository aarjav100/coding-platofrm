const express = require('express');
const router = express.Router();
const { getItems, buyItem, seedItems } = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getItems);
router.post('/buy', protect, buyItem);
router.post('/seed', seedItems); // Open for dev convenience, usually protected

module.exports = router;
