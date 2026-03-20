const { runCodeInUnknown } = require('../utils/dockerSandbox');

// @desc    Execute code
// @route   POST /api/execute
// @access  Public (or Private if you want to restrict to logged in users) - user said "User/Admin/Moderator"
//          but specifically mentioned "Code Execution Sandbox" limits.
//          We can keep it Public for demo, or protect it. The user requirements didn't explicitly strict logic.
//          However, to prevent abuse, we should probably require auth or rate limit heavily.
//          For now, I'll update it to check for user existence if we wanted, but let's keep it open or use a middleware later.
const executeCode = async (req, res) => {
    const { language, code, input } = req.body;

    if (!language || !code) {
        return res.status(400).json({ message: 'Language and Code are required' });
    }

    // Basic validation
    const supportedLanguages = ['python', 'javascript', 'cpp'];
    if (!supportedLanguages.includes(language)) {
        return res.status(400).json({ message: 'Unsupported language' });
    }

    try {
        const result = await runCodeInUnknown(language, code, input);
        res.json(result);
    } catch (error) {
        console.error('Execution Error:', error);
        res.status(500).json({
            message: 'Execution failed',
            error: error.message
        });
    }
};

module.exports = { executeCode };
