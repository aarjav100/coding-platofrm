const express = require('express');
const router = express.Router();
const { getMentorResponse, getCodeReview } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/mentor', protect, getMentorResponse);
router.post('/code-review', protect, getCodeReview);

module.exports = router;
