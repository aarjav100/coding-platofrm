const express = require('express');
const router = express.Router();
const { registerUser, authUser, addPoints } = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/add-points', protect, addPoints);

module.exports = router;
