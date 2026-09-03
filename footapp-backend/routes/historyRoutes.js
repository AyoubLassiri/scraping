// routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
// Uncomment the line below if you have an authentication middleware for your admin routes
// const authMiddleware = require('../middleware/authMiddleware');

// Public route to fetch history page data
router.get('/', historyController.getHistory);

// Admin route to update history page data (add authMiddleware if protected)
router.put('/', historyController.updateHistory);

module.exports = router;