const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');

// @desc    Submit a solution
// @route   POST /api/submissions
// @access  Private
const submitSolution = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const problem = await Problem.findById(problemId);

        if (!problem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        // --- SIMULATED EXECUTION LOGIC ---
        // In a real app, you would send 'code' to a judge (e.g., Piston, Judge0).
        // Here, we will just simulate a "Accepted" if the code is not empty 
        // and maybe check for a specific keyword or just random/always success for demo.
        // BUT, since the user wants "Solve coding problems", let's do a VERY basic check:
        // We can't easily run user code safely here without a sandbox. 
        // For MVP/Demo: match against "Expected Output" is impossible without running it.
        // PLAN: match specific hardcoded simple answers OR just mark as Accepted for now 
        // to unblock the flow, as requested in the plan "Simple Match" (placeholder).

        // For now: Always ACCEPT if code length > 10.
        // TODO: Integrate proper Judge0/Piston.

        let status = 'Accepted';
        if (!code || code.length < 10) {
            status = 'Wrong Answer';
        }

        // Calculate dummy metrics
        const executionTime = Math.floor(Math.random() * 100); // 0-100ms
        const memoryUsed = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 KB

        const submission = await Submission.create({
            user: req.user._id,
            problem: problemId,
            code,
            language,
            status,
            executionTime,
            memoryUsed
        });

        // Update User Profile (Points & Solved Problems) if Accepted
        if (status === 'Accepted') {
            const user = await User.findById(req.user._id);

            // Check if already solved to avoid duplicate points
            const isAlreadySolved = user.solvedProblems.includes(problemId);

            if (!isAlreadySolved) {
                user.solvedProblems.push(problemId);
                // Difficulty based points
                const pointsMap = { 'Easy': 10, 'Medium': 20, 'Hard': 50 };
                user.points += (pointsMap[problem.difficulty] || 10);
                await user.save();
            }
        }

        res.status(201).json(submission);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user submissions
// @route   GET /api/submissions/user
// @access  Private
const getUserSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({ user: req.user._id })
            .populate('problem', 'title difficulty')
            .sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    submitSolution,
    getUserSubmissions
};
