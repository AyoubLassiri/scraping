const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const verifyToken = require('../middleware/authMiddleware');

// Public route — client submits complaint
router.post('/', complaintController.createComplaint);

// Admin routes — protected
router.get('/', verifyToken, complaintController.getAllComplaints);
router.put('/:id', verifyToken, complaintController.updateComplaintStatus);
router.delete('/:id', verifyToken, complaintController.deleteComplaint);

module.exports = router;