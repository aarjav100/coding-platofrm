const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalProblems = await Problem.countDocuments({});

        // Active users in last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const activeUsers = await User.countDocuments({
            role: 'user',
            lastLogin: { $gte: sevenDaysAgo }
        });

        // Total Submissions (if Submission model exists and is populated)
        // If Submission model is not yet created, this might throw or return 0. 
        // We'll handle it gracefully or assume it exists based on plan.
        let totalSubmissions = 0;
        try {
            totalSubmissions = await Submission.countDocuments({});
        } catch (err) {
            console.log("Submission model might not be ready yet or query failed");
        }

        res.json({
            totalUsers,
            totalProblems,
            activeUsers,
            totalSubmissions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
