const express = require('express');
const router = express.Router();
const { createContest, getContests, getContestById, registerForContest } = require('../controllers/contestController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/')
    .get(getContests)
    .post(protect, admin, createContest);

router.route('/:id')
    .get(getContestById);

router.route('/:id/register')
    .post(protect, registerForContest);

module.exports = router;
