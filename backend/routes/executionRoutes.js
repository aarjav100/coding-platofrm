const express = require('express');
const router = express.Router();
const { executeCode } = require('../controllers/executionController');
const { protect } = require('../middleware/authMiddleware'); // Assuming we will have this, or use existing logic if any.
// Actually, I haven't created authMiddleware with 'protect' yet (it was in Phase 2). 
// The current codebase might have one? I'll check.
// If not, I'll leave it public for now or un-comment line when I add middleware.

router.post('/', executeCode);

module.exports = router;
