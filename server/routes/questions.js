const express = require('express');
const { dbAll, dbGet, dbRun } = require('../db/init');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  try {
    const { subject, difficulty } = req.query;
    let query = 'SELECT * FROM questions WHERE 1=1';
    const params = [];
    if (subject) { query += ' AND subject = ?'; params.push(subject); }
    if (difficulty) { query += ' AND difficulty = ?'; params.push(difficulty); }
    query += ' ORDER BY subject, difficulty';
    res.json(dbAll(query, params));
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في جلب الأسئلة' }); }
});

router.post('/', authMiddleware, adminOnly, (req, res) => {
  try {
    const { subject, question, option_a, option_b, option_c, option_d, correct_option, difficulty } = req.body;
    if (!subject || !question || !option_a || !option_b || !option_c || !option_d || !correct_option || !difficulty) {
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }
    const result = dbRun('INSERT INTO questions (subject, question, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES (?,?,?,?,?,?,?,?)',
      [subject, question, option_a, option_b, option_c, option_d, correct_option, difficulty]);
    const q = dbGet('SELECT * FROM questions WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(q);
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في إضافة السؤال' }); }
});

router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  try {
    dbRun('DELETE FROM questions WHERE id = ?', [req.params.id]);
    res.json({ message: 'تم حذف السؤال' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في حذف السؤال' }); }
});

router.post('/submit', authMiddleware, (req, res) => {
  try {
    const { student_id, subject, answers } = req.body;
    if (!student_id || !subject || !answers || !answers.length) return res.status(400).json({ error: 'البيانات غير مكتملة' });

    let score = 0;
    const total = answers.length;
    const mistakes = [];
    const feedback = [];

    for (const ans of answers) {
      const q = dbGet('SELECT * FROM questions WHERE id = ?', [ans.question_id]);
      if (!q) continue;
      if (ans.selected_option === q.correct_option) {
        score++;
      } else {
        const correctText = q[`option_${q.correct_option}`];
        mistakes.push({ question: q.question, correctOption: q.correct_option, correctText, selected: ans.selected_option, subject: q.subject });
        feedback.push(`❌ ${q.question} - الإجابة الصحيحة: ${correctText}`);
      }
    }

    const pct = Math.round((score / total) * 100);
    const level = pct >= 85 ? 'ممتاز' : pct >= 70 ? 'جيد' : pct >= 50 ? 'مقبول' : 'ضعيف';

    const result = dbRun('INSERT INTO test_results (student_id, subject, score, total, level, mistakes_json) VALUES (?,?,?,?,?,?)',
      [student_id, subject, score, total, level, JSON.stringify(mistakes)]);

    const suggestions = [];
    if (pct < 50) {
      suggestions.push(`📚 يُنصح بمراجعة دروس ${subject} من البداية`);
      suggestions.push('📝 حاول حل أسئلة بمستوى سهل أولاً');
    } else if (pct < 70) {
      suggestions.push(`📊 أداؤك مقبول في ${subject}، حاول التركيز على النقاط الضعيفة`);
    } else {
      suggestions.push(`🌟 أداء جيد في ${subject}!`);
    }

    const relatedLessons = dbAll('SELECT id, title FROM lessons WHERE subject = ?', [subject]);
    res.json({ score, total, percentage: pct, level, mistakes, feedback, suggestions, relatedLessons, testResultId: result.lastInsertRowid });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في تصحيح الاختبار' }); }
});

router.get('/results/:studentId', authMiddleware, (req, res) => {
  try {
    res.json(dbAll('SELECT * FROM test_results WHERE student_id = ? ORDER BY created_at DESC', [req.params.studentId]));
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في جلب النتائج' }); }
});

module.exports = router;
