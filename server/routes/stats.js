const express = require('express');
const { dbAll, dbGet } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');
const { calculateAverage, getPerformanceLevel, calculateAttendance } = require('../utils/smartLogic');

const router = express.Router();

router.get('/overview', authMiddleware, (req, res) => {
  try {
    const totalStudents = dbGet('SELECT COUNT(*) as c FROM students').c;
    const allRecords = dbAll('SELECT * FROM student_records');
    const grades = allRecords.map(r => r.grade);
    const generalAvg = grades.length > 0 ? Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 100) / 100 : 0;
    const highest = grades.length > 0 ? Math.max(...grades) : 0;
    const lowest = grades.length > 0 ? Math.min(...grades) : 0;
    const passed = allRecords.filter(r => r.grade >= 50).length;
    const failed = allRecords.filter(r => r.grade < 50).length;
    const totalAbsences = allRecords.reduce((a, r) => a + r.absences, 0);
    const avgAbsences = allRecords.length > 0 ? Math.round(totalAbsences / allRecords.length) : 0;
    const avgAttendance = calculateAttendance(avgAbsences);

    const departments = dbAll('SELECT DISTINCT department FROM students').map(d => d.department);
    const deptStats = departments.map(dept => {
      const stuIds = dbAll('SELECT id FROM students WHERE department = ?', [dept]).map(s => s.id);
      const deptRecords = allRecords.filter(r => stuIds.includes(r.student_id));
      return { department: dept, studentCount: stuIds.length, average: calculateAverage(deptRecords), passed: deptRecords.filter(r => r.grade >= 50).length, failed: deptRecords.filter(r => r.grade < 50).length };
    });

    res.json({ totalStudents, generalAvg, highest, lowest, passed, failed, totalRecords: allRecords.length, avgAttendance, deptStats });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في جلب الإحصائيات' }); }
});

router.get('/departments', authMiddleware, (req, res) => {
  try {
    const departments = dbAll('SELECT DISTINCT department FROM students').map(d => d.department);
    const allRecords = dbAll('SELECT sr.*, s.department, s.name as student_name FROM student_records sr JOIN students s ON sr.student_id = s.id');
    const stats = departments.map(dept => {
      const deptRecords = allRecords.filter(r => r.department === dept);
      const subjects = [...new Set(deptRecords.map(r => r.subject))];
      const subjectStats = subjects.map(sub => {
        const subRecords = deptRecords.filter(r => r.subject === sub);
        return { subject: sub, average: calculateAverage(subRecords), count: subRecords.length };
      });
      return { department: dept, average: calculateAverage(deptRecords), totalRecords: deptRecords.length, subjectStats };
    });
    res.json(stats);
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في جلب إحصائيات الأقسام' }); }
});

router.get('/student/:id', authMiddleware, (req, res) => {
  try {
    const student = dbGet('SELECT * FROM students WHERE id = ?', [req.params.id]);
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });
    const records = dbAll('SELECT * FROM student_records WHERE student_id = ? ORDER BY semester, subject', [req.params.id]);
    const testResults = dbAll('SELECT * FROM test_results WHERE student_id = ?', [req.params.id]);
    const avg = calculateAverage(records);
    const deptStudentIds = dbAll('SELECT id FROM students WHERE department = ?', [student.department]).map(s => s.id);
    
    let deptRecords = [];
    if (deptStudentIds.length > 0) {
      deptRecords = dbAll(`SELECT * FROM student_records WHERE student_id IN (${deptStudentIds.map(() => '?').join(',')})`, deptStudentIds);
    }
    const deptAvg = calculateAverage(deptRecords);
    const deptStudentAvgs = deptStudentIds.map(sid => {
      const sRecords = deptRecords.filter(r => r.student_id === sid);
      return { student_id: sid, avg: calculateAverage(sRecords) };
    }).sort((a, b) => b.avg - a.avg);
    const rank = deptStudentAvgs.findIndex(s => s.student_id === parseInt(req.params.id)) + 1;

    const subjectPerf = {};
    for (const r of records) {
      if (!subjectPerf[r.subject]) subjectPerf[r.subject] = [];
      subjectPerf[r.subject].push({ grade: r.grade, semester: r.semester, absences: r.absences });
    }

    res.json({ student, records, testResults, average: avg, performance: getPerformanceLevel(avg), departmentAverage: deptAvg, rank, totalInDept: deptStudentIds.length, aboveAverage: avg >= deptAvg, subjectPerformance: subjectPerf });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في جلب إحصائيات الطالب' }); }
});

module.exports = router;
