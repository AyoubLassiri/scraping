const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const [admins] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        if (admins.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const admin = admins[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};