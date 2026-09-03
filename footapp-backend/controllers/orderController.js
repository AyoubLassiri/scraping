const db = require('../config/db');

exports.createOrder = async (req, res) => {
    try {
        const { firstName, lastName, phone, address, city, items, totalPrice } = req.body;
        
        const [result] = await db.query(
            `INSERT INTO orders (first_name, last_name, phone, address, city, total_price, items) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, phone, address, city, totalPrice, JSON.stringify(items)]
        );
        
        res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};