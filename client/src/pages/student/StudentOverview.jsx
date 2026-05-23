import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Star, AlertTriangle, CheckCircle, ChevronLeft, GraduationCap, Calendar, Compass, UserCheck } from 'lucide-react';

function StudentOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.studentId) {
      fetchStudentData(user.studentId);
    }
  }, []);

  const fetchStudentData = async (id) => {
    try {
      const response = await axios.get(`/analysis/student/${id}`);
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-500 font-medium">جاري تحليل بياناتك الأكاديمية...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
        لم نتمكن من العثور على بيانات أكاديمية مرتبطة بحساب الطالب هذا.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Student Welcome Header Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-950 p-8 rounded-3xl text-white shadow-xl">
        <div className="absolute right-[-30px] top-[-30px] w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-500/30 uppercase tracking-wider">
              {data.student.department}
            </span>
            <h2 className="text-3xl font-black mt-3">أهلاً بك مجدداً، {data.student.name} 👋</h2>
            <p className="text-white/70 text-xs mt-1 font-medium">نظام المتابعة الذكية يرصد لك تفاصيل أدائك بشكل لحظي لتحسين نتائجك الأكاديمية.</p>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse bg-white/10 p-3 rounded-2xl border border-white/10">
            <Calendar size={18} className="text-purple-300" />
            <div className="text-right">
              <p className="text-[10px] text-white/50 font-bold">الفصل الدراسي الحالي</p>
              <p className="text-xs font-bold text-white">{data.student.semester}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GPA / Average Card */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100/60 p-6 flex items-center space-x-5 space-x-reverse interactive-card">
          <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
            <Star size={24} className="fill-purple-600/10" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">معدلك الدراسي العام</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{data.average}%</h3>
          </div>
        </div>

        {/* Academic Level Card */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100/60 p-6 flex items-center space-x-5 space-x-reverse interactive-card">
          <div className={`p-4 rounded-2xl ${
            data.performance.color === 'blue' ? 'bg-blue-50 text-blue-600' :
            data.performance.color === 'green' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
          }`}>
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">التقدير والمستوى</p>
            <h3 className="text-xl font-black text-slate-800 mt-1">{data.performance.label}</h3>
          </div>
        </div>

        {/* Absence Risk Status Card */}
        <div className="bg-white rounded-3xl shadow-md border border-slate-100/60 p-6 flex items-center space-x-5 space-x-reverse interactive-card">
          <div className={`p-4 rounded-2xl ${
            data.risk.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-600' :
            data.risk.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
          }`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400">مؤشر الخطر العام</p>
            <h3 className="text-xl font-black text-slate-800 mt-1">
              {data.risk.riskLevel === 'Low' ? 'منخفض وآمن' :
               data.risk.riskLevel === 'Medium' ? 'متوسط (تنبيه)' : 'مرتفع (خطر)'}
            </h3>
          </div>
        </div>
      </div>

      {/* Comparison Grid & Advice Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Panel: Advice (3 cols) */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100/60 lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2 space-x-reverse">
                <Compass className="text-purple-600" size={20} />
                <span>نصائح وتوجيهات الذكاء الأكاديمي</span>
              </h3>
              <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-1 rounded-md">موجهة لك</span>
            </div>
            
            <ul className="space-y-4 mt-6">
              {data.advice.map((adv, idx) => (
                <li key={idx} className="flex items-start space-x-3 space-x-reverse p-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100/60 rounded-2xl smooth-transition">
                  <CheckCircle size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-600 font-semibold leading-relaxed">{adv}</span>
                </li>
              ))}
              {data.advice.length === 0 && (
                <li className="text-center text-slate-400 text-xs py-8">لا توجد إرشادات مخصصة لك حالياً. استمر بالعمل الجيد!</li>
              )}
            </ul>
          </div>
        </div>

        {/* Right Panel: Department Average Comparison (2 cols) */}
        <div className="bg-white p-6 rounded-3xl shadow-md border border-slate-100/60 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">مقارنتك بالقسم الأكاديمي</h3>
            <p className="text-slate-400 text-xs mt-1">شاهد مستواك مقارنة بمتوسط الطلاب في تخصصك.</p>
          </div>
          
          <div className="my-6 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>معدلك الشخصي</span>
                <span className="text-purple-600">{data.average}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full" style={{ width: `${data.average}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>متوسط درجات القسم</span>
                <span className="text-slate-700">{data.departmentAverage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full rounded-full" style={{ width: `${data.departmentAverage}%` }}></div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-2xl text-center text-xs font-bold ${
            data.aboveAverage ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
          }`}>
            {data.aboveAverage ? '🎉 أداؤك الحالي يفوق متوسط درجات طلاب قسمك!' : '💡 أداؤك الحالي أقل من متوسط طلاب قسمك، ننصحك بالمزيد من الدراسة.'}
          </div>
        </div>
      </div>

      {/* Subject Grades & Absence List */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-100/60 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">تفاصيل المواد والدرجات</h3>
          <span className="text-xs text-slate-400 font-bold">الفصل الدراسي الأول 2024</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-500 text-xs">
              <tr>
                <th className="p-4 font-bold">المادة الدراسية</th>
                <th className="p-4 font-bold">درجة المادة</th>
                <th className="p-4 font-bold text-center">أيام الغياب</th>
                <th className="p-4 font-bold text-center">تقييم المشاركة</th>
                <th className="p-4 font-bold">حالة التحصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors text-xs font-semibold text-slate-600">
                  <td className="p-4 text-slate-900 font-bold text-sm">{record.subject}</td>
                  <td className="p-4 text-slate-900 font-bold text-sm">{record.grade}%</td>
                  <td className="p-4 text-center text-rose-600">{record.absences} أيام</td>
                  <td className="p-4 text-center text-indigo-600">{record.participation}/10 نقاط</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      record.grade >= 85 ? 'bg-emerald-50 text-emerald-700' :
                      record.grade >= 70 ? 'bg-indigo-50 text-indigo-700' :
                      record.grade >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {record.grade >= 85 ? 'ممتاز' :
                       record.grade >= 70 ? 'جيد جداً' :
                       record.grade >= 50 ? 'مقبول' : 'ضعيف جداً'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentOverview;
