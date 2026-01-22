const express = require('express');
const router = express.Router();
const { submitSolution, getUserSubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitSolution);
router.get('/user', protect, getUserSubmissions);

module.exports = router;
