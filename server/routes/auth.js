const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { dbAll, dbGet } = require('../db/init');
const { SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' });

    const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });

    let studentId = null;
    if (user.role === 'student') {
      const student = dbGet('SELECT id FROM students WHERE user_id = ?', [user.id]);
      if (student) studentId = student.id;
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name, studentId }, SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, studentId }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

module.exports = router;
