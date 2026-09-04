const db = require('../config/db');

// Get all posts (Public)
async function getAllPosts(req, res) {
    try {
        const [posts] = await db.query('SELECT * FROM posts ORDER BY created_at DESC');
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Server error while fetching posts' });
    }
}

// Create a new post (Admin)
async function createPost(req, res) {
    try {
        const { title, content } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const [result] = await db.query(
            'INSERT INTO posts (title, content, image) VALUES (?, ?, ?)',
            [title, content, image]
        );

        res.status(201).json({ id: result.insertId, title, content, image, message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Server error while creating post' });
    }
}

// Update an existing post (Admin)
async function updatePost(req, res) {
    try {
        const { id } = req.params;
        const { title, content, existingImage } = req.body;
        
        // If a new file is uploaded, use it. Otherwise, fallback to the existing image string.
        const image = req.file ? `/uploads/${req.file.filename}` : existingImage;

        await db.query(
            'UPDATE posts SET title = ?, content = ?, image = ? WHERE id = ?',
            [title, content, image, id]
        );

        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Server error while updating post' });
    }
}

// Delete a post (Admin)
async function deletePost(req, res) {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM posts WHERE id = ?', [id]);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Server error while deleting post' });
    }
}

module.exports = {
    getAllPosts,
    createPost,
    updatePost,
    deletePost
};