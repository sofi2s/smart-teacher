const express = require('express');
const { dbAll, dbGet, dbRun } = require('../db/init');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const { subject } = req.query;
    const lessons = subject
      ? dbAll('SELECT * FROM lessons WHERE subject = ? ORDER BY created_at DESC', [subject])
      : dbAll('SELECT * FROM lessons ORDER BY created_at DESC');
    res.json(lessons);
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في جلب الدروس' }); }
});

router.get('/:id', authMiddleware, (req, res) => {
  try {
    const lesson = dbGet('SELECT * FROM lessons WHERE id = ?', [req.params.id]);
    if (!lesson) return res.status(404).json({ error: 'الدرس غير موجود' });
    res.json(lesson);
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في جلب الدرس' }); }
});

router.post('/', authMiddleware, adminOnly, (req, res) => {
  try {
    const { title, description, subject, pdf_url, video_url, content } = req.body;
    if (!title || !subject) return res.status(400).json({ error: 'العنوان والمادة مطلوبان' });
    const result = dbRun('INSERT INTO lessons (title, description, subject, pdf_url, video_url, content) VALUES (?,?,?,?,?,?)',
      [title, description || '', subject, pdf_url || '', video_url || '', content || '']);
    const lesson = dbGet('SELECT * FROM lessons WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(lesson);
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في إضافة الدرس' }); }
});

router.put('/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    const { title, description, subject, pdf_url, video_url, content } = req.body;
    dbRun('UPDATE lessons SET title=?, description=?, subject=?, pdf_url=?, video_url=?, content=? WHERE id=?',
      [title, description, subject, pdf_url, video_url, content, req.params.id]);
    const lesson = dbGet('SELECT * FROM lessons WHERE id = ?', [req.params.id]);
    res.json(lesson);
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في تحديث الدرس' }); }
});

router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    dbRun('DELETE FROM lessons WHERE id = ?', [req.params.id]);
    res.json({ message: 'تم حذف الدرس بنجاح' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في حذف الدرس' }); }
});

module.exports = router;
