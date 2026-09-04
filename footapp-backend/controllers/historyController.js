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

// Update history page content (Dynamic Sections)
async function updateHistory(req, res) {
    try {
        const { title, sections } = req.body;
        
        // تحويل مصفوفة الأقسام إلى نص JSON لحفظها في قاعدة البيانات
        const sectionsJson = JSON.stringify(sections || []);

        // خدعة برمجية: محاولة إضافة عمود sections إلى الجدول في حال لم يكن موجوداً مسبقاً
        try {
            await db.query("ALTER TABLE history ADD COLUMN sections LONGTEXT");
        } catch (e) {
            // يتم تجاهل الخطأ إذا كان العمود موجوداً بالفعل
        }

        // Check if record exists
        const [rows] = await db.query('SELECT id FROM history ORDER BY id DESC LIMIT 1');

        if (rows.length > 0) {
            const historyId = rows[0].id;
            await db.query(`
                UPDATE history SET 
                    title = ?, 
                    sections = ?
                WHERE id = ?
            `, [title, sectionsJson, historyId]);
        } else {
            await db.query(`
                INSERT INTO history (
                    title, 
                    sections
                ) VALUES (?, ?)
            `, [title, sectionsJson]);
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