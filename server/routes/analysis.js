const express = require('express');
const { dbAll, dbGet } = require('../db/init');
const { authMiddleware } = require('../middleware/auth');
const { calculateAverage, getPerformanceLevel, calculateAttendance, detectDifficultSubjects, detectStrugglingStudents, predictStudentRisk, generateStudentAdvice } = require('../utils/smartLogic');

const router = express.Router();

router.get('/admin', authMiddleware, (req, res) => {
  try {
    const allRecords = dbAll('SELECT sr.*, s.name as student_name, s.department FROM student_records sr JOIN students s ON sr.student_id = s.id');
    const difficultSubjects = detectDifficultSubjects(allRecords);
    const strugglingStudents = detectStrugglingStudents(allRecords);
    const departments = [...new Set(allRecords.map(r => r.department))];
    const deptAnalysis = departments.map(dept => {
      const deptRecords = allRecords.filter(r => r.department === dept);
      const avg = calculateAverage(deptRecords);
      return { department: dept, average: avg, performance: getPerformanceLevel(avg), totalRecords: deptRecords.length };
    });
    const overallAvg = calculateAverage(allRecords);
    const totalFailed = allRecords.filter(r => r.grade < 50).length;
    const totalPassed = allRecords.filter(r => r.grade >= 50).length;
    const passRate = allRecords.length > 0 ? Math.round((totalPassed / allRecords.length) * 100) : 0;
    const highAbsenceRecords = allRecords.filter(r => r.absences > 6);
    const lowAbsenceRecords = allRecords.filter(r => r.absences <= 3);
    const absenceImpact = {
      highAbsenceAvg: calculateAverage(highAbsenceRecords),
      lowAbsenceAvg: calculateAverage(lowAbsenceRecords),
      highAbsenceCount: highAbsenceRecords.length,
      lowAbsenceCount: lowAbsenceRecords.length
    };
    const solutions = [];
    if (strugglingStudents.length > 0) solutions.push(`👥 يوجد ${strugglingStudents.length} طالب يحتاج دعم أكاديمي فوري`);
    if (difficultSubjects.length > 0 && difficultSubjects[0].average < 60) solutions.push(`📚 مادة "${difficultSubjects[0].subject}" تحتاج لمراجعة طريقة التدريس (معدل: ${difficultSubjects[0].average})`);
    if (absenceImpact.highAbsenceAvg < absenceImpact.lowAbsenceAvg - 10) solutions.push('⚠️ الغياب يؤثر بشكل واضح على الأداء. يُنصح بتطبيق سياسة حضور صارمة');
    if (passRate < 70) solutions.push('📊 نسبة النجاح أقل من 70%. يُنصح بعمل حصص مراجعة إضافية');
    res.json({ overallAvg, passRate, totalPassed, totalFailed, difficultSubjects, strugglingStudents, deptAnalysis, absenceImpact, solutions });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في التحليل' }); }
});

router.get('/student/:studentId', authMiddleware, (req, res) => {
  try {
    const student = dbGet('SELECT * FROM students WHERE id = ?', [req.params.studentId]);
    if (!student) return res.status(404).json({ error: 'الطالب غير موجود' });
    const records = dbAll('SELECT * FROM student_records WHERE student_id = ? ORDER BY semester', [req.params.studentId]);
    const testResults = dbAll('SELECT * FROM test_results WHERE student_id = ?', [req.params.studentId]);
    const avg = calculateAverage(records);
    const performance = getPerformanceLevel(avg);
    const maxAbs = records.length > 0 ? Math.max(...records.map(r => r.absences)) : 0;
    const minPart = records.length > 0 ? Math.min(...records.map(r => r.participation)) : 0;
    const risk = predictStudentRisk({ grade: avg, absences: maxAbs, participation: minPart });
    const advice = generateStudentAdvice({ records, testResults });
    const strengths = records.filter(r => r.grade >= 70).map(r => ({ subject: r.subject, grade: r.grade, semester: r.semester }));
    const weaknesses = records.filter(r => r.grade < 60).map(r => ({ subject: r.subject, grade: r.grade, semester: r.semester }));
    const semesters = [...new Set(records.map(r => r.semester))];
    const progress = semesters.map(sem => {
      const semRecords = records.filter(r => r.semester === sem);
      return { semester: sem, average: calculateAverage(semRecords), subjects: semRecords.length };
    });
    const deptStudentIds = dbAll('SELECT id FROM students WHERE department = ?', [student.department]).map(s => s.id);
    let allDeptRecords = [];
    if (deptStudentIds.length > 0) {
      allDeptRecords = dbAll(`SELECT * FROM student_records WHERE student_id IN (${deptStudentIds.map(() => '?').join(',')})`, deptStudentIds);
    }
    const deptAvg = calculateAverage(allDeptRecords);
    res.json({ student, records, testResults, average: avg, performance, risk, advice, strengths, weaknesses, progress, departmentAverage: deptAvg, aboveAverage: avg >= deptAvg });
  } catch (err) { console.error(err); res.status(500).json({ error: 'خطأ في تحليل بيانات الطالب' }); }
});

module.exports = router;
