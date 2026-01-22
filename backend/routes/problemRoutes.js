const express = require('express');
const router = express.Router();
const {
    createProblem,
    getProblems,
    getProblemById,
    updateProblem,
    deleteProblem
} = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/')
    .get(getProblems)
    .post(protect, admin, createProblem);

router.route('/:id')
    .get(getProblemById)
    .put(protect, admin, updateProblem)
    .delete(protect, admin, deleteProblem);

module.exports = router;
