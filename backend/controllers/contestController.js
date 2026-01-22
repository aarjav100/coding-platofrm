const Contest = require('../models/Contest');

// @desc    Create a contest
// @route   POST /api/contests
// @access  Private/Admin
const createContest = async (req, res) => {
    try {
        const { title, description, startTime, endTime, problems } = req.body;

        const contest = await Contest.create({
            title,
            description,
            startTime,
            endTime,
            problems
        });

        res.status(201).json(contest);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all contests
// @route   GET /api/contests
// @access  Public
const getContests = async (req, res) => {
    try {
        const contests = await Contest.find({}).sort({ startTime: -1 });
        res.json(contests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get contest by ID
// @route   GET /api/contests/:id
// @access  Public
const getContestById = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id)
            .populate('problems', 'title difficulty')
            .populate('participants', 'username points');

        if (contest) {
            res.json(contest);
        } else {
            res.status(404).json({ message: 'Contest not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register for contest
// @route   POST /api/contests/:id/register
// @access  Private
const registerForContest = async (req, res) => {
    try {
        const contest = await Contest.findById(req.params.id);

        if (!contest) {
            return res.status(404).json({ message: 'Contest not found' });
        }

        if (contest.participants.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already registered' });
        }

        contest.participants.push(req.user._id);
        await contest.save();

        res.json({ message: 'Registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createContest,
    getContests,
    getContestById,
    registerForContest
};
