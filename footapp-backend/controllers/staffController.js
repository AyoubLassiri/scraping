const db = require('../config/db');

exports.getAllStaff = async (req, res) => {
    try {
        const [staff] = await db.query('SELECT * FROM staff ORDER BY created_at DESC');
        res.status(200).json(staff);
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createStaff = async (req, res) => {
    try {
        const { name, role, description } = req.body;

        if (!name || !name.trim() || !role || !role.trim()) {
            return res.status(400).json({ message: 'Name and role are required' });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        await db.query(
            `INSERT INTO staff (name, role, description, image) VALUES (?, ?, ?, ?)`,
            [name.trim(), role.trim(), description ? description.trim() : null, imageUrl]
        );

        res.status(201).json({ message: 'Staff member created successfully' });
    } catch (error) {
        console.error('Error creating staff:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        const { name, role, description, existingImage } = req.body;

        if (!name || !name.trim() || !role || !role.trim()) {
            return res.status(400).json({ message: 'Name and role are required' });
        }

        let imageUrl = existingImage || null;
        if (req.file) {
            imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        await db.query(
            `UPDATE staff SET name = ?, role = ?, description = ?, image = ? WHERE id = ?`,
            [name.trim(), role.trim(), description ? description.trim() : null, imageUrl, staffId]
        );

        res.status(200).json({ message: 'Staff member updated successfully' });
    } catch (error) {
        console.error('Error updating staff:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        const staffId = req.params.id;
        await db.query('DELETE FROM staff WHERE id = ?', [staffId]);
        res.status(200).json({ message: 'Staff member deleted successfully' });
    } catch (error) {
        console.error('Error deleting staff:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};