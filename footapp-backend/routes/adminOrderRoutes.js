const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware'); // Remove { }

// Get all store orders (Admin only)
router.get('/', verifyToken, async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;