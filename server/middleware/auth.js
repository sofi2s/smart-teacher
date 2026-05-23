const jwt = require('jsonwebtoken');
const SECRET = 'smart-teacher-secret-key-2024';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح - يرجى تسجيل الدخول' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'جلسة منتهية - يرجى تسجيل الدخول مرة أخرى' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'هذا الإجراء مخصص للمشرفين فقط' });
  }
  next();
}

module.exports = { authMiddleware, adminOnly, SECRET };
