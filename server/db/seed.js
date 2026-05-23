const bcrypt = require('bcryptjs');
const { dbAll, dbGet, dbRun, saveDB } = require('./init');

function seedDB() {
  const row = dbGet('SELECT COUNT(*) as c FROM users');
  if (row && row.c > 0) return;

  const hash = (pw) => bcrypt.hashSync(pw, 10);

  // ===== USERS =====
  const iu = (name, email, pw, role, uid, dept) =>
    dbRun('INSERT INTO users (name, email, password, role, university_id, department) VALUES (?,?,?,?,?,?)', [name, email, pw, role, uid, dept]);
  
  iu('المشرف الرئيسي', 'admin@smart.edu', hash('admin123'), 'admin', null, null);
  iu('أحمد محمد', 'student@smart.edu', hash('student123'), 'student', '2024001', 'الذكاء الاصطناعي والروبوتات');
  iu('سارة خالد', 'sara@smart.edu', hash('student123'), 'student', '2024002', 'علوم الحاسوب');
  iu('عمر يوسف', 'omar@smart.edu', hash('student123'), 'student', '2024003', 'الهندسة الكهربائية');
  iu('لينا أحمد', 'lina@smart.edu', hash('student123'), 'student', '2024004', 'الذكاء الاصطناعي والروبوتات');
  iu('محمد علي', 'mohamad@smart.edu', hash('student123'), 'student', '2024005', 'علوم الحاسوب');
  iu('نور حسين', 'noor@smart.edu', hash('student123'), 'student', '2024006', 'الهندسة الكهربائية');
  iu('ياسمين عبدالله', 'yasmin@smart.edu', hash('student123'), 'student', '2024007', 'الذكاء الاصطناعي والروبوتات');
  iu('خالد إبراهيم', 'khaled@smart.edu', hash('student123'), 'student', '2024008', 'علوم الحاسوب');

  // ===== STUDENTS =====
  const is = (uid, name, uniId, dept, sem) =>
    dbRun('INSERT INTO students (user_id, name, university_id, department, semester) VALUES (?,?,?,?,?)', [uid, name, uniId, dept, sem]);
  is(2, 'أحمد محمد', '2024001', 'الذكاء الاصطناعي والروبوتات', 'الأول 2024');
  is(3, 'سارة خالد', '2024002', 'علوم الحاسوب', 'الأول 2024');
  is(4, 'عمر يوسف', '2024003', 'الهندسة الكهربائية', 'الأول 2024');
  is(5, 'لينا أحمد', '2024004', 'الذكاء الاصطناعي والروبوتات', 'الأول 2024');
  is(6, 'محمد علي', '2024005', 'علوم الحاسوب', 'الأول 2024');
  is(7, 'نور حسين', '2024006', 'الهندسة الكهربائية', 'الأول 2024');
  is(8, 'ياسمين عبدالله', '2024007', 'الذكاء الاصطناعي والروبوتات', 'الأول 2024');
  is(9, 'خالد إبراهيم', '2024008', 'علوم الحاسوب', 'الأول 2024');

  // ===== STUDENT RECORDS =====
  const ir = (sid, sub, grade, abs, part, sem) =>
    dbRun('INSERT INTO student_records (student_id, subject, grade, absences, participation, semester) VALUES (?,?,?,?,?,?)', [sid, sub, grade, abs, part, sem]);
  
  // أحمد - AI dept - excellent
  ir(1, 'الرياضيات', 92, 2, 9, 'الأول 2024');
  ir(1, 'البرمجة', 88, 1, 8, 'الأول 2024');
  ir(1, 'الذكاء الاصطناعي', 95, 0, 10, 'الأول 2024');
  ir(1, 'هياكل البيانات', 85, 3, 7, 'الأول 2024');
  ir(1, 'الرياضيات', 94, 1, 9, 'الثاني 2024');
  ir(1, 'البرمجة', 91, 0, 10, 'الثاني 2024');

  // سارة - CS dept - good
  ir(2, 'الرياضيات', 78, 4, 6, 'الأول 2024');
  ir(2, 'البرمجة', 82, 2, 7, 'الأول 2024');
  ir(2, 'هياكل البيانات', 75, 5, 5, 'الأول 2024');
  ir(2, 'الإلكترونيات', 70, 3, 6, 'الأول 2024');
  ir(2, 'الرياضيات', 81, 3, 7, 'الثاني 2024');

  // عمر - EE dept - struggling
  ir(3, 'الرياضيات', 45, 10, 3, 'الأول 2024');
  ir(3, 'الإلكترونيات', 52, 8, 4, 'الأول 2024');
  ir(3, 'البرمجة', 38, 12, 2, 'الأول 2024');
  ir(3, 'الرياضيات', 42, 11, 3, 'الثاني 2024');

  // لينا - AI dept - excellent
  ir(4, 'الرياضيات', 97, 0, 10, 'الأول 2024');
  ir(4, 'البرمجة', 93, 1, 9, 'الأول 2024');
  ir(4, 'الذكاء الاصطناعي', 98, 0, 10, 'الأول 2024');
  ir(4, 'هياكل البيانات', 90, 2, 8, 'الأول 2024');

  // محمد - CS dept - average
  ir(5, 'الرياضيات', 55, 7, 4, 'الأول 2024');
  ir(5, 'البرمجة', 62, 5, 5, 'الأول 2024');
  ir(5, 'هياكل البيانات', 48, 9, 3, 'الأول 2024');
  ir(5, 'الإلكترونيات', 58, 6, 4, 'الأول 2024');

  // نور - EE dept - good
  ir(6, 'الرياضيات', 73, 3, 7, 'الأول 2024');
  ir(6, 'الإلكترونيات', 85, 1, 9, 'الأول 2024');
  ir(6, 'البرمجة', 68, 4, 6, 'الأول 2024');

  // ياسمين - AI dept - average to good
  ir(7, 'الرياضيات', 65, 5, 5, 'الأول 2024');
  ir(7, 'البرمجة', 72, 3, 7, 'الأول 2024');
  ir(7, 'الذكاء الاصطناعي', 78, 2, 8, 'الأول 2024');
  ir(7, 'هياكل البيانات', 60, 6, 4, 'الأول 2024');

  // خالد - CS dept - weak
  ir(8, 'الرياضيات', 35, 14, 2, 'الأول 2024');
  ir(8, 'البرمجة', 42, 11, 3, 'الأول 2024');
  ir(8, 'هياكل البيانات', 30, 15, 1, 'الأول 2024');
  ir(8, 'الإلكترونيات', 44, 10, 2, 'الأول 2024');

  // ===== LESSONS =====
  const il = (title, desc, sub, pdf, vid, content) =>
    dbRun('INSERT INTO lessons (title, description, subject, pdf_url, video_url, content) VALUES (?,?,?,?,?,?)', [title, desc, sub, pdf, vid, content]);
  
  il('مقدمة في التفاضل والتكامل', 'شرح أساسيات التفاضل والتكامل', 'الرياضيات', 'https://example.com/calculus.pdf', 'https://www.youtube.com/watch?v=WUvTyaaNkzM', 'التفاضل هو أحد فروع الرياضيات الذي يدرس معدل التغير. يُستخدم في حساب السرعة والتسارع والميل.\n\nالمفاهيم الأساسية:\n1. النهايات (Limits)\n2. المشتقات (Derivatives)\n3. قواعد الاشتقاق\n4. التكامل المحدد وغير المحدد');
  il('أساسيات البرمجة بلغة Python', 'تعلم أساسيات لغة Python من الصفر', 'البرمجة', 'https://example.com/python.pdf', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 'Python هي لغة برمجة عالية المستوى.\n\nالمواضيع:\n1. المتغيرات وأنواع البيانات\n2. الجمل الشرطية\n3. الحلقات\n4. الدوال\n5. القوائم والقواميس');
  il('مبادئ الإلكترونيات', 'مقدمة في عالم الإلكترونيات', 'الإلكترونيات', 'https://example.com/electronics.pdf', 'https://www.youtube.com/watch?v=mc979OhitAg', 'الإلكترونيات فرع من الهندسة الكهربائية.\n\nالمفاهيم:\n1. الجهد والتيار والمقاومة\n2. قانون أوم\n3. المكثفات\n4. الترانزستور');
  il('مقدمة في الذكاء الاصطناعي', 'تعرف على أساسيات AI', 'الذكاء الاصطناعي', 'https://example.com/ai.pdf', 'https://www.youtube.com/watch?v=2ePf9rue1Ao', 'الذكاء الاصطناعي هو محاكاة الذكاء البشري.\n\nالمواضيع:\n1. التعلم الآلي\n2. التعلم العميق\n3. معالجة اللغة الطبيعية\n4. الرؤية الحاسوبية');
  il('هياكل البيانات والخوارزميات', 'دراسة هياكل البيانات', 'هياكل البيانات', 'https://example.com/ds.pdf', 'https://www.youtube.com/watch?v=bum_19loj9A', 'هياكل البيانات طرق تنظيم البيانات.\n\nالهياكل:\n1. المصفوفات\n2. القوائم المرتبطة\n3. المكدسات\n4. الطوابير\n5. الأشجار');
  il('الجبر الخطي', 'المصفوفات والمتجهات', 'الرياضيات', 'https://example.com/linear.pdf', 'https://www.youtube.com/watch?v=fNk_zzaMoSs', 'الجبر الخطي يدرس المتجهات والمصفوفات.\n\nالمواضيع:\n1. المتجهات\n2. المصفوفات\n3. المحددات\n4. الأنظمة الخطية');
  il('البرمجة كائنية التوجه', 'مفاهيم OOP', 'البرمجة', 'https://example.com/oop.pdf', 'https://www.youtube.com/watch?v=pTB0EiLXUC8', 'OOP نمط برمجي يعتمد على الكائنات.\n\nالمفاهيم:\n1. الأصناف والكائنات\n2. التغليف\n3. الوراثة\n4. تعدد الأشكال');
  il('الشبكات العصبية', 'مقدمة في Neural Networks', 'الذكاء الاصطناعي', 'https://example.com/nn.pdf', 'https://www.youtube.com/watch?v=aircAruvnKk', 'الشبكات العصبية مستوحاة من الدماغ البشري.\n\nالمواضيع:\n1. البيرسبترون\n2. التغذية الأمامية\n3. الانتشار العكسي\n4. دوال التنشيط');

  // ===== QUESTIONS =====
  const iq = (sub, q, a, b, c, d, cor, diff) =>
    dbRun('INSERT INTO questions (subject, question, option_a, option_b, option_c, option_d, correct_option, difficulty) VALUES (?,?,?,?,?,?,?,?)', [sub, q, a, b, c, d, cor, diff]);

  iq('الرياضيات', 'ما هي مشتقة الدالة f(x) = x²؟', 'x', '2x', '2', 'x²', 'b', 'easy');
  iq('الرياضيات', 'ما هو تكامل 2x؟', 'x²', 'x² + C', '2x²', 'x + C', 'b', 'easy');
  iq('الرياضيات', 'ما هي قيمة sin(90°)؟', '0', '1', '-1', '0.5', 'b', 'easy');
  iq('الرياضيات', 'ما هي مشتقة sin(x)؟', '-cos(x)', 'cos(x)', 'tan(x)', '-sin(x)', 'b', 'medium');
  iq('الرياضيات', 'ما هو ناتج ∫cos(x)dx؟', '-sin(x)+C', 'sin(x)+C', 'cos(x)+C', 'tan(x)+C', 'b', 'medium');
  iq('الرياضيات', 'ما هي محددة المصفوفة [[1,2],[3,4]]؟', '2', '-2', '10', '-10', 'b', 'hard');

  iq('البرمجة', 'ما هو ناتج print(type(5)) في Python؟', 'float', 'int', 'str', 'num', 'b', 'easy');
  iq('البرمجة', 'أي من التالي يُنشئ قائمة في Python؟', '{}', '()', '[]', '<>', 'c', 'easy');
  iq('البرمجة', 'ما هو ناتج len("Hello")؟', '4', '5', '6', 'خطأ', 'b', 'easy');
  iq('البرمجة', 'ما هي الكلمة المفتاحية لتعريف دالة في Python؟', 'function', 'def', 'func', 'define', 'b', 'easy');
  iq('البرمجة', 'ما الفرق بين == و is في Python؟', 'لا فرق', '== للقيمة و is للمرجع', '== للمرجع و is للقيمة', 'كلاهما للمرجع', 'b', 'medium');
  iq('البرمجة', 'ما هو مفهوم الـ Decorator في Python؟', 'نوع بيانات', 'دالة تُغلف دالة أخرى', 'متغير ثابت', 'حلقة تكرارية', 'b', 'hard');

  iq('الإلكترونيات', 'ما هي وحدة قياس التيار الكهربائي؟', 'فولت', 'أوم', 'أمبير', 'واط', 'c', 'easy');
  iq('الإلكترونيات', 'ما هو قانون أوم؟', 'V = IR', 'V = I/R', 'V = R/I', 'I = VR', 'a', 'easy');
  iq('الإلكترونيات', 'ما هي وظيفة المكثف؟', 'تحويل التيار', 'تخزين الطاقة الكهربائية', 'زيادة المقاومة', 'توليد الطاقة', 'b', 'medium');
  iq('الإلكترونيات', 'ما هو الترانزستور؟', 'مقاومة متغيرة', 'عنصر تبديل وتضخيم', 'مصدر تيار', 'مكثف كبير', 'b', 'medium');

  iq('الذكاء الاصطناعي', 'ما هو التعلم الآلي؟', 'برمجة يدوية', 'تعلم الآلة من البيانات', 'قواعد بيانات', 'شبكات حاسوب', 'b', 'easy');
  iq('الذكاء الاصطناعي', 'أي من التالي من خوارزميات التعلم الخاضع للإشراف؟', 'K-Means', 'Linear Regression', 'PCA', 'Autoencoder', 'b', 'medium');
  iq('الذكاء الاصطناعي', 'ما هي دالة التنشيط ReLU؟', 'f(x) = 1/(1+e^-x)', 'f(x) = max(0, x)', 'f(x) = tanh(x)', 'f(x) = x²', 'b', 'hard');

  iq('هياكل البيانات', 'ما هو المكدس (Stack)؟', 'FIFO', 'LIFO', 'Random Access', 'Sequential', 'b', 'easy');
  iq('هياكل البيانات', 'ما تعقيد Binary Search في مصفوفة مرتبة؟', 'O(n)', 'O(log n)', 'O(n²)', 'O(1)', 'b', 'medium');
  iq('هياكل البيانات', 'ما أفضل تعقيد زمني لخوارزمية الترتيب؟', 'O(n²)', 'O(n log n)', 'O(n)', 'O(log n)', 'b', 'hard');

  // ===== TEST RESULTS =====
  const it = (sid, sub, score, total, level, mistakes) =>
    dbRun('INSERT INTO test_results (student_id, subject, score, total, level, mistakes_json) VALUES (?,?,?,?,?,?)', [sid, sub, score, total, level, JSON.stringify(mistakes)]);
  it(1, 'الرياضيات', 5, 6, 'ممتاز', []);
  it(1, 'البرمجة', 5, 6, 'ممتاز', [{q: 'ما هو مفهوم الـ Decorator؟', correct: 'b'}]);
  it(2, 'الرياضيات', 4, 6, 'جيد', [{q: 'محددة المصفوفة', correct: 'b'}]);
  it(3, 'البرمجة', 2, 6, 'ضعيف', [{q: 'type(5)', correct: 'b'},{q: 'len("Hello")', correct: 'b'}]);
  it(5, 'هياكل البيانات', 1, 3, 'ضعيف', [{q: 'Binary Search', correct: 'b'}]);
  it(8, 'الرياضيات', 1, 6, 'ضعيف', [{q: 'مشتقة x²', correct: 'b'}]);

  // ===== NOTIFICATIONS =====
  const inot = (sid, msg, type) =>
    dbRun('INSERT INTO notifications (student_id, message, type) VALUES (?,?,?)', [sid, msg, type]);
  inot(1, 'أداؤك ممتاز! استمر بالتفوق 🌟', 'success');
  inot(3, 'تحذير: نسبة غيابك مرتفعة، يرجى الالتزام بالحضور', 'warning');
  inot(3, 'درجتك في البرمجة أقل من الحد المطلوب', 'danger');
  inot(5, 'درجتك في هياكل البيانات تحتاج لتحسين', 'warning');
  inot(8, 'تحذير عاجل: أنت في خطر الرسوب في عدة مواد', 'danger');
  inot(8, 'يرجى مراجعة المشرف الأكاديمي في أقرب وقت', 'warning');
  inot(2, 'أداء جيد! حاول تحسين درجة الرياضيات', 'info');
  inot(4, 'مبروك! أنت من أفضل الطلاب في القسم 🏆', 'success');

  console.log('✅ Database seeded successfully!');
}

module.exports = { seedDB };
