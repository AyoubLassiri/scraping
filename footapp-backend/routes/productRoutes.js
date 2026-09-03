const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

router.post('/', verifyToken, upload.array('images', 5), productController.createProduct);
router.put('/:id', verifyToken, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;