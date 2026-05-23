const express = require('express');
const { dbAll, dbGet } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');
const { generateChatbotResponse } = require('../utils/smartLogic');

const router = express.Router();

router.post('/admin', authMiddleware, (req, res) => {
  try {
    const { message, studentId } = req.body;
    if (!message) return res.status(400).json({ error: 'الرسالة مطلوبة' });
    let studentData = null;
    if (studentId) {
      const student = dbGet('SELECT * FROM students WHERE id = ?', [studentId]);
      if (student) {
        const records = dbAll('SELECT * FROM student_records WHERE student_id = ?', [studentId]);
        const testResults = dbAll('SELECT * FROM test_results WHERE student_id = ?', [studentId]);
        studentData = { ...student, records, testResults };
      }
    }
    const response = generateChatbotResponse(message, studentData, 'admin');
    res.json({ response, studentId });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في المحادثة' }); }
});

router.post('/student', authMiddleware, (req, res) => {
  try {
    const { message, studentId } = req.body;
    if (!message || !studentId) return res.status(400).json({ error: 'الرسالة ومعرف الطالب مطلوبان' });
    const student = dbGet('SELECT * FROM students WHERE id = ?', [studentId]);
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });
    const records = dbAll('SELECT * FROM student_records WHERE student_id = ?', [studentId]);
    const testResults = dbAll('SELECT * FROM test_results WHERE student_id = ?', [studentId]);
    const studentData = { ...student, records, testResults };
    const response = generateChatbotResponse(message, studentData, 'student');
    res.json({ response });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في المحادثة' }); }
});

module.exports = router;
