import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Star, AlertTriangle, CheckCircle } from 'lucide-react';

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

  if (loading) return <div>جاري التحميل...</div>;
  if (!data) return <div className="text-red-500">حدث خطأ أو أن الحساب غير مرتبط بطالب في النظام.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">نظرة عامة على أدائك</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4 space-x-reverse">
          <div className="p-3 bg-secondary/10 text-secondary rounded-full">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">المعدل العام</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.average}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4 space-x-reverse">
          <div className={`p-3 rounded-full ${data.performance.color === 'blue' ? 'bg-blue-100 text-blue-600' : data.performance.color === 'green' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">المستوى الأكاديمي</p>
            <h3 className="text-xl font-bold text-gray-900">{data.performance.label}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4 space-x-reverse">
          <div className={`p-3 rounded-full ${data.risk.riskLevel === 'Low' ? 'bg-green-100 text-green-600' : data.risk.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">مؤشر الخطر (الغياب والدرجات)</p>
            <h3 className="text-xl font-bold text-gray-900">{data.risk.riskLevel === 'Low' ? 'منخفض' : data.risk.riskLevel === 'Medium' ? 'متوسط' : 'عالي'}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">التوجيهات الأكاديمية (AI-Rules)</h3>
        <ul className="space-y-3">
          {data.advice.map((adv, idx) => (
            <li key={idx} className="flex items-start space-x-3 space-x-reverse p-3 bg-blue-50/50 rounded-lg">
              <CheckCircle size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{adv}</span>
            </li>
          ))}
          {data.advice.length === 0 && <li className="text-gray-500">لا توجد توجيهات حالياً.</li>}
        </ul>
      </div>
    </div>
  );
}

export default StudentOverview;
