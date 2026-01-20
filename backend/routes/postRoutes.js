const express = require('express');
const router = express.Router();
const {
    getPosts,
    createPost,
    getPostById,
    deletePost,
    updatePost
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getPosts).post(protect, createPost);
router
    .route('/:id')
    .get(getPostById)
    .delete(protect, deletePost)
    .put(protect, updatePost);

module.exports = router;
