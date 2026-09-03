const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', staffController.getAllStaff);
router.post('/', verifyToken, upload.single('image'), staffController.createStaff);
router.put('/:id', verifyToken, upload.single('image'), staffController.updateStaff);
router.delete('/:id', verifyToken, staffController.deleteStaff);

module.exports = router;