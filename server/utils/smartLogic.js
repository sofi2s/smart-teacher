// Smart logic helper functions

const TOTAL_LECTURES = 30;

function calculateAverage(records) {
  if (!records || records.length === 0) return 0;
  const sum = records.reduce((acc, r) => acc + r.grade, 0);
  return Math.round((sum / records.length) * 100) / 100;
}

function getPerformanceLevel(grade) {
  if (grade >= 85) return { label: 'ممتاز', labelEn: 'Excellent', color: 'green' };
  if (grade >= 70) return { label: 'جيد', labelEn: 'Good', color: 'blue' };
  if (grade >= 50) return { label: 'مقبول', labelEn: 'Average', color: 'yellow' };
  return { label: 'ضعيف', labelEn: 'Weak', color: 'red' };
}

function getPassFailStatus(grade) {
  return grade >= 50 ? { label: 'ناجح', passed: true } : { label: 'راسب', passed: false };
}

function calculateAttendance(absences, totalLectures = TOTAL_LECTURES) {
  const attended = Math.max(0, totalLectures - absences);
  const attendancePercent = Math.round((attended / totalLectures) * 100);
  const absencePercent = Math.round((absences / totalLectures) * 100);
  return { attended, attendancePercent, absencePercent, totalLectures };
}

function detectDifficultSubjects(records) {
  const subjectMap = {};
  for (const r of records) {
    if (!subjectMap[r.subject]) subjectMap[r.subject] = [];
    subjectMap[r.subject].push(r.grade);
  }
  const results = [];
  for (const [subject, grades] of Object.entries(subjectMap)) {
    const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
    const failCount = grades.filter(g => g < 50).length;
    results.push({ subject, average: Math.round(avg * 100) / 100, failCount, totalStudents: grades.length, failRate: Math.round((failCount / grades.length) * 100) });
  }
  return results.sort((a, b) => a.average - b.average);
}

function detectStrugglingStudents(allRecords) {
  const studentMap = {};
  for (const r of allRecords) {
    if (!studentMap[r.student_id]) studentMap[r.student_id] = { records: [], name: r.student_name || r.name };
    studentMap[r.student_id].records.push(r);
  }
  const struggling = [];
  for (const [id, data] of Object.entries(studentMap)) {
    const avg = calculateAverage(data.records);
    const maxAbsences = Math.max(...data.records.map(r => r.absences));
    const failedSubjects = data.records.filter(r => r.grade < 50).length;
    if (avg < 60 || failedSubjects > 0 || maxAbsences > 8) {
      struggling.push({ student_id: parseInt(id), name: data.name, average: avg, failedSubjects, maxAbsences, risk: predictStudentRisk({ grade: avg, absences: maxAbsences, participation: 0 }) });
    }
  }
  return struggling.sort((a, b) => a.average - b.average);
}

function predictStudentRisk(record) {
  const grade = record.grade;
  const absences = record.absences;
  const participation = record.participation || 0;

  if (grade < 50 && absences > 8) return { level: 'خطر عالي', levelEn: 'High Risk', color: 'red', prediction: 'احتمال رسوب مرتفع' };
  if (grade < 50) return { level: 'خطر عالي', levelEn: 'High Risk', color: 'red', prediction: 'الدرجة أقل من الحد الأدنى' };
  if (grade >= 50 && grade < 70 && participation < 4) return { level: 'خطر متوسط', levelEn: 'Medium Risk', color: 'orange', prediction: 'يحتاج متابعة ودعم إضافي' };
  if (grade >= 50 && grade < 70 && absences > 6) return { level: 'خطر متوسط', levelEn: 'Medium Risk', color: 'orange', prediction: 'الغياب قد يؤثر على الأداء' };
  if (grade >= 85 && absences <= 3) return { level: 'خطر منخفض', levelEn: 'Low Risk', color: 'green', prediction: 'أداء ممتاز ومستقر' };
  return { level: 'خطر منخفض', levelEn: 'Low Risk', color: 'green', prediction: 'أداء مقبول' };
}

function generateStudentAdvice(studentData) {
  const { records, testResults } = studentData;
  const advice = [];
  const avg = calculateAverage(records);
  
  if (avg < 50) advice.push('⚠️ معدلك العام أقل من الحد الأدنى. يجب التركيز على الدراسة بشكل مكثف.');
  else if (avg < 70) advice.push('📊 معدلك مقبول لكن يمكنك التحسن. حاول زيادة ساعات المذاكرة.');
  else if (avg >= 85) advice.push('🌟 معدلك ممتاز! استمر في هذا المستوى.');

  const highAbsences = records.filter(r => r.absences > 6);
  if (highAbsences.length > 0) {
    advice.push(`⚠️ لديك غياب مرتفع في: ${highAbsences.map(r => r.subject).join('، ')}. الحضور مهم جداً.`);
  }

  const weakSubjects = records.filter(r => r.grade < 50);
  if (weakSubjects.length > 0) {
    advice.push(`📚 تحتاج لمراجعة: ${weakSubjects.map(r => r.subject).join('، ')}`);
  }

  const lowParticipation = records.filter(r => r.participation < 4);
  if (lowParticipation.length > 0) {
    advice.push('🗣️ حاول زيادة مشاركتك في المحاضرات لتحسين فهمك.');
  }

  if (testResults && testResults.length > 0) {
    const weakTests = testResults.filter(t => (t.score / t.total) < 0.5);
    if (weakTests.length > 0) {
      advice.push(`📝 نتائج اختباراتك ضعيفة في: ${weakTests.map(t => t.subject).join('، ')}. حاول حل تمارين إضافية.`);
    }
  }

  if (advice.length === 0) advice.push('👍 أداؤك جيد بشكل عام. حافظ على مستواك!');
  return advice;
}

function generateChatbotResponse(userMessage, studentData, role = 'admin') {
  const msg = userMessage.toLowerCase();
  
  if (!studentData && role === 'admin') {
    return 'الرجاء اختيار طالب أولاً لتحليل أدائه.';
  }

  if (!studentData) {
    return 'لا تتوفر بيانات كافية للتحليل. تأكد من وجود سجلات أكاديمية.';
  }

  const records = studentData.records || [];
  const testResults = studentData.testResults || [];
  const avg = calculateAverage(records);
  const perf = getPerformanceLevel(avg);
  const weakSubjects = records.filter(r => r.grade < 50);
  const highAbsences = records.filter(r => r.absences > 6);
  const strongSubjects = records.filter(r => r.grade >= 85);

  // Keyword-based responses
  if (msg.includes('مستوى') || msg.includes('أداء') || msg.includes('تقييم') || msg.includes('level') || msg.includes('performance')) {
    let response = `📊 **تقييم الطالب ${studentData.name || ''}:**\n`;
    response += `• المعدل العام: ${avg}\n`;
    response += `• مستوى الأداء: ${perf.label}\n`;
    if (weakSubjects.length > 0) response += `• مواد ضعيفة: ${weakSubjects.map(r => `${r.subject} (${r.grade})`).join('، ')}\n`;
    if (strongSubjects.length > 0) response += `• مواد متفوق فيها: ${strongSubjects.map(r => `${r.subject} (${r.grade})`).join('، ')}\n`;
    response += `• التوصية: ${predictStudentRisk({grade: avg, absences: Math.max(...records.map(r=>r.absences), 0), participation: 0}).prediction}`;
    return response;
  }

  if (msg.includes('غياب') || msg.includes('حضور') || msg.includes('attendance') || msg.includes('absence')) {
    if (highAbsences.length > 0) {
      return `⚠️ **تحذير الغياب:**\nالطالب لديه غياب مرتفع في:\n${highAbsences.map(r => `• ${r.subject}: ${r.absences} محاضرات (${calculateAttendance(r.absences).absencePercent}%)`).join('\n')}\n\n💡 التوصية: يجب التواصل مع الطالب لمعرفة أسباب الغياب وتقديم الدعم اللازم.`;
    }
    return '✅ نسبة حضور الطالب جيدة ولا توجد مشاكل في الغياب.';
  }

  if (msg.includes('ضعف') || msg.includes('صعوبة') || msg.includes('مشكل') || msg.includes('weak') || msg.includes('problem')) {
    if (weakSubjects.length > 0) {
      return `📚 **نقاط الضعف:**\n${weakSubjects.map(r => `• ${r.subject}: ${r.grade}/100 - ${getPerformanceLevel(r.grade).label}`).join('\n')}\n\n💡 **التوصيات:**\n• مراجعة دروس ${weakSubjects.map(r=>r.subject).join(' و ')}\n• حل اختبارات تجريبية بمستوى سهل أولاً\n• زيادة ساعات المذاكرة\n• حضور جلسات مراجعة`;
    }
    return '✅ لا توجد نقاط ضعف واضحة. الطالب يؤدي بشكل جيد في جميع المواد.';
  }

  if (msg.includes('اختبار') || msg.includes('امتحان') || msg.includes('test') || msg.includes('exam')) {
    if (testResults.length > 0) {
      let response = `📝 **نتائج الاختبارات:**\n`;
      for (const t of testResults) {
        const pct = Math.round((t.score / t.total) * 100);
        response += `• ${t.subject}: ${t.score}/${t.total} (${pct}%) - ${t.level}\n`;
      }
      if (weakSubjects.length > 0) {
        response += `\n💡 أقترح اختباراً بمستوى سهل في: ${weakSubjects.map(r=>r.subject).join('، ')}`;
      }
      return response;
    }
    return '📝 لا توجد نتائج اختبارات سابقة لهذا الطالب. يمكنك إنشاء اختبار جديد من صفحة الاختبارات.';
  }

  if (msg.includes('نصيحة') || msg.includes('تحسين') || msg.includes('advice') || msg.includes('improve')) {
    const advice = generateStudentAdvice({ records, testResults });
    return `💡 **نصائح للتحسين:**\n${advice.map(a => `${a}`).join('\n')}`;
  }

  if (msg.includes('قوة') || msg.includes('تفوق') || msg.includes('strength') || msg.includes('strong')) {
    if (strongSubjects.length > 0) {
      return `💪 **نقاط القوة:**\n${strongSubjects.map(r => `• ${r.subject}: ${r.grade}/100 - ممتاز`).join('\n')}\n\n🌟 الطالب متفوق في هذه المواد ويمكنه مساعدة زملائه.`;
    }
    return '📊 لا توجد مواد بدرجة ممتازة حالياً. يحتاج الطالب لمزيد من الجهد.';
  }

  // Default comprehensive response
  let response = `📊 **ملخص أداء الطالب ${studentData.name || ''}:**\n`;
  response += `• المعدل: ${avg} (${perf.label})\n`;
  response += `• عدد المواد: ${records.length}\n`;
  if (weakSubjects.length > 0) response += `• مواد تحتاج تحسين: ${weakSubjects.map(r=>r.subject).join('، ')}\n`;
  if (highAbsences.length > 0) response += `• تحذير غياب في: ${highAbsences.map(r=>r.subject).join('، ')}\n`;
  response += `\n💬 يمكنك سؤالي عن: المستوى، الغياب، نقاط الضعف، نقاط القوة، الاختبارات، أو نصائح للتحسين.`;
  return response;
}

module.exports = {
  calculateAverage, getPerformanceLevel, getPassFailStatus, calculateAttendance,
  detectDifficultSubjects, detectStrugglingStudents, predictStudentRisk,
  generateStudentAdvice, generateChatbotResponse, TOTAL_LECTURES
};
