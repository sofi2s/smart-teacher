import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, X, GraduationCap, AlertCircle } from 'lucide-react';

function StudentsManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [uniId, setUniId] = useState('');
  const [dept, setDept] = useState('الذكاء الاصطناعي والروبوتات');
  const [semester, setSemester] = useState('الأول 2024');
  
  // Grade record addition states
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [subject, setSubject] = useState('الرياضيات');
  const [grade, setGrade] = useState('');
  const [absences, setAbsences] = useState('0');
  const [participation, setParticipation] = useState('8');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟ سيتم حذف جميع سجلاته ودرجاته نهائياً.')) {
      try {
        await axios.delete(`/students/${id}`);
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
      }
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!name || !uniId) return;

    try {
      await axios.post('/students', { name, university_id: uniId, department: dept, semester });
      setShowAddModal(false);
      setName('');
      setUniId('');
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.error || 'حدث خطأ أثناء إضافة الطالب');
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !grade) return;

    try {
      await axios.post(`/students/${selectedStudent.id}/records`, {
        subject,
        grade: Number(grade),
        absences: Number(absences),
        participation: Number(participation),
        semester: selectedStudent.semester
      });
      setShowRecordModal(false);
      setGrade('');
      setAbsences('0');
      setParticipation('8');
      fetchStudents();
    } catch (err) {
      alert('حدث خطأ أثناء إضافة السجل الأكاديمي');
    }
  };

  const departments = [...new Set(students.map(s => s.department))];

  const filteredStudents = students.filter(s => {
    const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.university_id.includes(searchTerm);
    const matchDept = filterDept ? s.department === filterDept : true;
    return matchName && matchDept;
  });

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">إدارة سجلات الطلاب</h2>
          <p className="text-slate-500 text-xs mt-1">تصفح بيانات الطلاب، وأضف الدرجات وسجلات الحضور والغياب والمشاركة.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 space-x-reverse bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/10 transition-all hover:scale-[1.02]"
        >
          <Plus size={16} />
          <span>إضافة طالب جديد</span>
        </button>
      </div>

      {/* Main Table Panel */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100/60 overflow-hidden">
        {/* Search & Filter Section */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50/30">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="البحث باسم الطالب أو رقمه الأكاديمي..." 
              className="w-full pl-4 pr-11 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold placeholder-slate-400 smooth-transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border border-slate-200 rounded-2xl px-5 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-bold text-slate-600 smooth-transition cursor-pointer"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">جميع التخصصات المتاحة</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="p-4 font-bold">الرقم الجامعي</th>
                <th className="p-4 font-bold">اسم الطالب</th>
                <th className="p-4 font-bold">التخصص</th>
                <th className="p-4 font-bold">المعدل العام</th>
                <th className="p-4 font-bold">المستوى الدراسي</th>
                <th className="p-4 font-bold">الحالة</th>
                <th className="p-4 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400">جاري تحميل بيانات الطلاب...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-slate-400">لا يوجد طلاب متوافقين مع شروط البحث والفلترة.</td></tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-slate-900">{student.university_id}</td>
                    <td className="p-4 text-slate-900 font-bold text-sm">{student.name}</td>
                    <td className="p-4">{student.department}</td>
                    <td className="p-4 text-slate-950 font-bold text-sm">{student.average}%</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        student.performance.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                        student.performance.color === 'green' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'
                      }`}>
                        {student.performance.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        student.status.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {student.status.label}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center space-x-2 space-x-reverse">
                      <button 
                        onClick={() => { setSelectedStudent(student); setShowRecordModal(true); }}
                        className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-all"
                      >
                        إضافة درجات
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="حذف الطالب"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-base">إضافة طالب جديد للأنظمة</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 smooth-transition">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2">اسم الطالب الثلاثي</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: أحمد محمد علي" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2">الرقم الجامعي (الرقم الأكاديمي)</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: 2024009" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold"
                  value={uniId}
                  onChange={(e) => setUniId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2">القسم الأكاديمي (التخصص)</label>
                <select 
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-bold text-slate-600"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                >
                  <option value="الذكاء الاصطناعي والروبوتات">الذكاء الاصطناعي والروبوتات</option>
                  <option value="علوم الحاسوب">علوم الحاسوب</option>
                  <option value="الهندسة الكهربائية">الهندسة الكهربائية</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2">الفصل الدراسي للتسجيل</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: الأول 2024" 
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                />
              </div>

              <div className="pt-4 flex space-x-3 space-x-reverse">
                <button 
                  type="submit" 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg shadow-indigo-600/10 transition-all"
                >
                  حفظ وتسجيل الطالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Grade/Record Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-800 text-base">إضافة درجة جديدة للمقرر</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">للطالب: {selectedStudent?.name}</p>
              </div>
              <button onClick={() => setShowRecordModal(false)} className="p-1 rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 smooth-transition">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleAddRecord} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-2">المادة الدراسية (المقرر)</label>
                <select 
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-bold text-slate-600"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="الرياضيات">الرياضيات</option>
                  <option value="البرمجة">البرمجة</option>
                  <option value="الذكاء الاصطناعي">الذكاء الاصطناعي</option>
                  <option value="هياكل البيانات">هياكل البيانات</option>
                  <option value="الإلكترونيات">الإلكترونيات</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-2">الدرجة النهائية</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    max="100"
                    placeholder="مثال: 85" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-2">أيام الغياب</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="مثال: 2" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold"
                    value={absences}
                    onChange={(e) => setAbsences(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-2">المشاركة (/10)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    max="10"
                    placeholder="مثال: 8" 
                    className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold"
                    value={participation}
                    onChange={(e) => setParticipation(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex space-x-3 space-x-reverse">
                <button 
                  type="submit" 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg shadow-indigo-600/10 transition-all"
                >
                  تسجيل الدرجات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsManagement;
