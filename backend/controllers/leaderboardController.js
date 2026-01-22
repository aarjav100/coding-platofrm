const User = require('../models/User');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Public
const getGlobalLeaderboard = async (req, res) => {
    try {
        // Find users with role 'user', sort by points (desc) and then by solvedProblems count (desc)
        // Limit to top 50
        const users = await User.find({ role: 'user' })
            .select('username points solvedProblems lastLogin')
            .sort({ points: -1, 'solvedProblems.length': -1 })
            .limit(50);

        // Map to add solved count explicitly if needed (though solvedProblems array length is sufficient)
        const leaderboard = users.map(user => ({
            _id: user._id,
            username: user.username,
            points: user.points,
            solvedCount: user.solvedProblems ? user.solvedProblems.length : 0,
            lastLogin: user.lastLogin
        }));

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getGlobalLeaderboard };
