const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM products');
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const [product] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
        
        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json(product[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        let { id, name, price, description, sizes, inStock, promoType, promoValue } = req.body;
        
        if (!id || id.trim() === '') {
            const randomSuffix = Date.now().toString().slice(-5);
            const sanitizedName = name ? name.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9ع-ي-]/g, '') : 'product';
            id = `${sanitizedName}-${randomSuffix}`;
        }

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
        } else if (req.body.images) {
            imageUrls = typeof req.body.images === 'string' ? JSON.parse(req.body.images) : req.body.images;
        }

        const parsedSizes = typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()) : sizes;
        const pType = promoType || 'none';
        const pVal = promoValue ? Number(promoValue) : 0.00;
        
        await db.query(
            `INSERT INTO products (id, name, price, description, images, sizes, inStock, promoType, promoValue) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id.trim(), name, price, description, JSON.stringify(imageUrls), JSON.stringify(parsedSizes), inStock === 'false' || inStock === false ? false : true, pType, pVal]
        );
        
        res.status(201).json({ message: 'Product created successfully', id: id.trim() });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'A product with this ID already exists.' });
        }
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, description, sizes, inStock, promoType, promoValue, existingImages } = req.body;
        
        let imageUrls = [];

        if (existingImages) {
            try {
                imageUrls = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
            } catch (e) {
                imageUrls = [existingImages];
            }
        }

        if (req.files && req.files.length > 0) {
            const newFileUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
            imageUrls = [...imageUrls, ...newFileUrls];
        }

        const parsedSizes = typeof sizes === 'string' ? sizes.split(',').map(s => s.trim()) : sizes;
        const pType = promoType || 'none';
        const pVal = promoValue ? Number(promoValue) : 0.00;

        await db.query(
            `UPDATE products SET name = ?, price = ?, description = ?, images = ?, sizes = ?, inStock = ?, promoType = ?, promoValue = ? WHERE id = ?`,
            [
                name, 
                price, 
                description, 
                JSON.stringify(imageUrls), 
                JSON.stringify(parsedSizes), 
                inStock === 'false' || inStock === false ? false : true, 
                pType,
                pVal,
                productId
            ]
        );
        
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete a product (Admin only)
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await db.query('DELETE FROM products WHERE id = ?', [productId]);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};