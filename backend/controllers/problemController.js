const Problem = require('../models/Problem');

// @desc    Create a new problem
// @route   POST /api/problems
// @access  Private/Admin
const createProblem = async (req, res) => {
    try {
        const { title, description, difficulty, constraints, inputFormat, outputFormat, testCases, template } = req.body;

        const problem = await Problem.create({
            title,
            description,
            difficulty,
            constraints,
            inputFormat,
            outputFormat,
            testCases,
            template
        });

        res.status(201).json(problem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all problems
// @route   GET /api/problems
// @access  Public
const getProblems = async (req, res) => {
    try {
        const problems = await Problem.find({});
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get problem by ID
// @route   GET /api/problems/:id
// @access  Public
const getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (problem) {
            res.json(problem);
        } else {
            res.status(404).json({ message: 'Problem not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a problem
// @route   PUT /api/problems/:id
// @access  Private/Admin
const updateProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);

        if (problem) {
            problem.title = req.body.title || problem.title;
            problem.description = req.body.description || problem.description;
            problem.difficulty = req.body.difficulty || problem.difficulty;
            problem.constraints = req.body.constraints || problem.constraints;
            problem.inputFormat = req.body.inputFormat || problem.inputFormat;
            problem.outputFormat = req.body.outputFormat || problem.outputFormat;
            problem.testCases = req.body.testCases || problem.testCases;
            problem.template = req.body.template || problem.template;

            const updatedProblem = await problem.save();
            res.json(updatedProblem);
        } else {
            res.status(404).json({ message: 'Problem not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a problem
// @route   DELETE /api/problems/:id
// @access  Private/Admin
const deleteProblem = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (problem) {
            await problem.deleteOne();
            res.json({ message: 'Problem removed' });
        } else {
            res.status(404).json({ message: 'Problem not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProblem,
    getProblems,
    getProblemById,
    updateProblem,
    deleteProblem
};
