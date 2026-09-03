// controllers/historyController.js
const db = require('../config/db');

// Get history page content
async function getHistory(req, res) {
    try {
        const [rows] = await db.query('SELECT * FROM history ORDER BY id DESC LIMIT 1');
        if (rows.length === 0) {
            return res.status(404).json({ error: 'History content not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching history content:', error);
        res.status(500).json({ error: 'Server error while fetching history' });
    }
}

// Update history page content (Admin)
async function updateHistory(req, res) {
    try {
        const {
            title,
            section1Text,
            section1Image,
            section1Caption,
            section2Text,
            section2Image,
            section2Caption,
            section3Text,
            section3Media,
            section3Caption
        } = req.body;

        // Check if a record exists
        const [rows] = await db.query('SELECT id FROM history ORDER BY id DESC LIMIT 1');

        // Format array texts into JSON strings if they are arrays
        const s1TextJson = JSON.stringify(section1Text);
        const s2TextJson = JSON.stringify(section2Text);
        const s3TextJson = JSON.stringify(section3Text);

        if (rows.length > 0) {
            const historyId = rows[0].id;
            await db.query(`
                UPDATE history SET 
                    title = ?, 
                    section1Text = ?, 
                    section1Image = ?, 
                    section1Caption = ?, 
                    section2Text = ?, 
                    section2Image = ?, 
                    section2Caption = ?, 
                    section3Text = ?, 
                    section3Media = ?, 
                    section3Caption = ?
                WHERE id = ?
            `, [
                title, s1TextJson, section1Image, section1Caption,
                s2TextJson, section2Image, section2Caption,
                s3TextJson, section3Media, section3Caption,
                historyId
            ]);
        } else {
            await db.query(`
                INSERT INTO history (
                    title, section1Text, section1Image, section1Caption, 
                    section2Text, section2Image, section2Caption, 
                    section3Text, section3Media, section3Caption
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                title, s1TextJson, section1Image, section1Caption,
                s2TextJson, section2Image, section2Caption,
                s3TextJson, section3Media, section3Caption
            ]);
        }

        res.json({ message: 'History content updated successfully' });
    } catch (error) {
        console.error('Error updating history content:', error);
        res.status(500).json({ error: 'Server error while updating history' });
    }
}

module.exports = {
    getHistory,
    updateHistory
};