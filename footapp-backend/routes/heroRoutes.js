const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const upload = require('../middleware/uploadMiddleware'); // same middleware used for posts
const verifyToken = require('../middleware/authMiddleware');

// Public route — homepage reads current hero image
router.get('/', heroController.getHeroSettings);

// Admin route — upload new hero image
router.put('/', verifyToken, upload.single('image'), heroController.updateHeroSettings);

module.exports = router;