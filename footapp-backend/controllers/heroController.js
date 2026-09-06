const db = require('../config/db');

// Get current hero settings (Public)
async function getHeroSettings(req, res) {
    try {
        const [rows] = await db.query('SELECT * FROM hero_settings WHERE id = 1');
        res.json(rows[0] || { id: 1, image: null });
    } catch (error) {
        console.error('Error fetching hero settings:', error);
        res.status(500).json({ error: 'Server error while fetching hero settings' });
    }
}

// Update hero background image (Admin)
async function updateHeroSettings(req, res) {
    try {
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        if (!image) {
            return res.status(400).json({ error: 'An image file is required' });
        }

        await db.query('UPDATE hero_settings SET image = ? WHERE id = 1', [image]);

        res.json({ image, message: 'Hero image updated successfully' });
    } catch (error) {
        console.error('Error updating hero settings:', error);
        res.status(500).json({ error: 'Server error while updating hero settings' });
    }
}

module.exports = {
    getHeroSettings,
    updateHeroSettings
};