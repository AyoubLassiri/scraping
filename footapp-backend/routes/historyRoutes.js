const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const upload = require('../middleware/uploadMiddleware'); // تأكد من مسار ملف الرفع لديك

// جلب البيانات
router.get('/', historyController.getHistory);

// حفظ البيانات (JSON)
router.put('/', historyController.updateHistory);

// مسار جديد لرفع وسائط الأقسام بشكل فردي ومباشر
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // إرجاع رابط الملف بعد رفعه
    res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;