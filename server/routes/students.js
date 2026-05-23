const express = require('express');
const { dbAll, dbGet, dbRun } = require('../db/init');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { calculateAverage, getPerformanceLevel, getPassFailStatus } = require('../utils/smartLogic');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const students = dbAll('SELECT * FROM students ORDER BY name');
    const result = students.map(s => {
      const records = dbAll('SELECT * FROM student_records WHERE student_id = ? ORDER BY semester, subject', [s.id]);
      const avg = calculateAverage(records);
      return { ...s, records, average: avg, performance: getPerformanceLevel(avg), status: getPassFailStatus(avg) };
    });
    res.json(result);
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في جلب البيانات' }); }
});

router.get('/:id', authMiddleware, (req, res) => {
  try {
    const student = dbGet('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });
    const records = dbAll('SELECT * FROM student_records WHERE student_id = ? ORDER BY semester, subject', [student.id]);
    const testResults = dbAll('SELECT * FROM test_results WHERE student_id = ? ORDER BY created_at DESC', [student.id]);
    const notifications = dbAll('SELECT * FROM notifications WHERE student_id = ? ORDER BY created_at DESC', [student.id]);
    const avg = calculateAverage(records);
    res.json({ ...student, records, testResults, notifications, average: avg, performance: getPerformanceLevel(avg), status: getPassFailStatus(avg) });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في جلب البيانات' }); }
});

router.post('/', authMiddleware, adminOnly, (req, res) => {
  try {
    const { name, university_id, department, semester, subject, grade, absences, participation } = req.body;
    if (!name || !university_id || !department || !semester) return res.status(400).json({ error: 'جميع الحقول الأساسية مطلوبة' });

    let student = dbGet('SELECT * FROM students WHERE university_id = ?', [university_id]);
    if (!student) {
      const result = dbRun('INSERT INTO students (name, university_id, department, semester) VALUES (?,?,?,?)', [name, university_id, department, semester]);
      student = { id: result.lastInsertRowid };
    }
    if (subject && grade !== undefined) {
      dbRun('INSERT INTO student_records (student_id, subject, grade, absences, participation, semester) VALUES (?,?,?,?,?,?)',
        [student.id, subject, grade, absences || 0, participation || 0, semester]);
    }
    const fullStudent = dbGet('SELECT * FROM students WHERE id = ?', [student.id]);
    const records = dbAll('SELECT * FROM student_records WHERE student_id = ?', [student.id]);
    res.status(201).json({ ...fullStudent, records, average: calculateAverage(records) });
  } catch (err) {
    console.error(err);
    if (err.message && err.message.includes('UNIQUE')) return res.status(400).json({ error: 'الرقم الجامعي مسجل مسبقاً' });
    res.status(500).json({ error: 'خطأ في إضافة الطالب' });
  }
});

router.put('/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const { name, university_id, department, semester } = req.body;
    dbRun('UPDATE students SET name=?, university_id=?, department=?, semester=? WHERE id=?', [name, university_id, department, semester, req.params.id]);
    const student = dbGet('SELECT * FROM students WHERE id = ?', [req.params.id]);
    const records = dbAll('SELECT * FROM student_records WHERE student_id = ?', [req.params.id]);
    res.json({ ...student, records, average: calculateAverage(records) });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في تحديث البيانات' }); }
});

router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    dbRun('DELETE FROM student_records WHERE student_id = ?', [req.params.id]);
    dbRun('DELETE FROM test_results WHERE student_id = ?', [req.params.id]);
    dbRun('DELETE FROM notifications WHERE student_id = ?', [req.params.id]);
    dbRun('DELETE FROM students WHERE id = ?', [req.params.id]);
    res.json({ message: 'تم حذف الطالب بنجاح' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في حذف الطالب' }); }
});

router.post('/:id/records', authMiddleware, adminOnly, (req, res) => {
  try {
    const { subject, grade, absences, participation, semester } = req.body;
    dbRun('INSERT INTO student_records (student_id, subject, grade, absences, participation, semester) VALUES (?,?,?,?,?,?)',
      [req.params.id, subject, grade, absences || 0, participation || 0, semester]);
    const records = dbAll('SELECT * FROM student_records WHERE student_id = ?', [req.params.id]);
    res.status(201).json({ records, average: calculateAverage(records) });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في إضافة السجل' }); }
});

router.delete('/records/:recordId', authMiddleware, adminOnly, (req, res) => {
  try {
    dbRun('DELETE FROM student_records WHERE id = ?', [req.params.recordId]);
    res.json({ message: 'تم حذف السجل' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في حذف السجل' }); }
});

module.exports = router;
