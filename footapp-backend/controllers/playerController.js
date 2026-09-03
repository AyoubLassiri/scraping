const db = require('../config/db');

exports.getAllPlayers = async (req, res) => {
    try {
        const [players] = await db.query('SELECT * FROM players ORDER BY number ASC, created_at DESC');
        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createPlayer = async (req, res) => {
    try {
        const { name, position, number, description } = req.body;

        if (!name || !name.trim() || !position || !position.trim()) {
            return res.status(400).json({ message: 'Name and position are required' });
        }

        let imageUrl = null;
        if (req.file) {
            imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        await db.query(
            `INSERT INTO players (name, position, number, description, image) VALUES (?, ?, ?, ?, ?)`,
            [name.trim(), position.trim(), number ? Number(number) : null, description ? description.trim() : null, imageUrl]
        );

        res.status(201).json({ message: 'Player added successfully' });
    } catch (error) {
        console.error('Error creating player:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updatePlayer = async (req, res) => {
    try {
        const playerId = req.params.id;
        const { name, position, number, description, existingImage } = req.body;

        if (!name || !name.trim() || !position || !position.trim()) {
            return res.status(400).json({ message: 'Name and position are required' });
        }

        let imageUrl = existingImage || null;
        if (req.file) {
            imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        await db.query(
            `UPDATE players SET name = ?, position = ?, number = ?, description = ?, image = ? WHERE id = ?`,
            [name.trim(), position.trim(), number ? Number(number) : null, description ? description.trim() : null, imageUrl, playerId]
        );

        res.status(200).json({ message: 'Player updated successfully' });
    } catch (error) {
        console.error('Error updating player:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deletePlayer = async (req, res) => {
    try {
        const playerId = req.params.id;
        await db.query('DELETE FROM players WHERE id = ?', [playerId]);
        res.status(200).json({ message: 'Player deleted successfully' });
    } catch (error) {
        console.error('Error deleting player:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};