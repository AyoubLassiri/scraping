const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware'); // Adjust path if needed

// Public Route
router.get('/', postController.getAllPosts);

// Admin Routes (Add authMiddleware if you are protecting admin routes)
router.post('/', upload.single('image'), postController.createPost);
router.put('/:id', upload.single('image'), postController.updatePost);
router.delete('/:id', postController.deletePost);

module.exports = router;