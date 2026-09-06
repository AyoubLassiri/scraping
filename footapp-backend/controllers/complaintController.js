const db = require('../config/db');

// Submit a complaint (Public)
async function createComplaint(req, res) {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !message) {
            return res.status(400).json({ error: 'Name and message are required' });
        }

        const [result] = await db.query(
            'INSERT INTO complaints (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name, email || null, phone || null, message]
        );

        res.status(201).json({ id: result.insertId, message: 'Complaint submitted successfully' });
    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({ error: 'Server error while submitting complaint' });
    }
}

// Get all complaints (Admin)
async function getAllComplaints(req, res) {
    try {
        const [complaints] = await db.query('SELECT * FROM complaints ORDER BY created_at DESC');
        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'Server error while fetching complaints' });
    }
}

// Update complaint status (Admin)
async function updateComplaintStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await db.query('UPDATE complaints SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Complaint status updated' });
    } catch (error) {
        console.error('Error updating complaint:', error);
        res.status(500).json({ error: 'Server error while updating complaint' });
    }
}

// Delete a complaint (Admin)
async function deleteComplaint(req, res) {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM complaints WHERE id = ?', [id]);
        res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        console.error('Error deleting complaint:', error);
        res.status(500).json({ error: 'Server error while deleting complaint' });
    }
}

module.exports = {
    createComplaint,
    getAllComplaints,
    updateComplaintStatus,
    deleteComplaint
};