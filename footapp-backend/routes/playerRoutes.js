const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', playerController.getAllPlayers);
router.post('/', verifyToken, upload.single('image'), playerController.createPlayer);
router.put('/:id', verifyToken, upload.single('image'), playerController.updatePlayer);
router.delete('/:id', verifyToken, playerController.deletePlayer);

module.exports = router;