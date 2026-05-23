import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

function StudentsManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');

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
    if (window.confirm('هل أنت متأكد من حذف هذا الطالب؟ سيتم حذف جميع سجلاته.')) {
      try {
        await axios.delete(`/students/${id}`);
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
      }
    }
  };

  const departments = [...new Set(students.map(s => s.department))];

  const filteredStudents = students.filter(s => {
    const matchName = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.university_id.includes(searchTerm);
    const matchDept = filterDept ? s.department === filterDept : true;
    return matchName && matchDept;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">إدارة الطلاب</h2>
        <button className="flex items-center space-x-2 space-x-reverse bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={20} />
          <span>إضافة طالب جديد</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="البحث بالاسم أو الرقم الجامعي..." 
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="">جميع التخصصات</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4 font-medium">الرقم الجامعي</th>
                <th className="p-4 font-medium">اسم الطالب</th>
                <th className="p-4 font-medium">التخصص</th>
                <th className="p-4 font-medium">المعدل العام</th>
                <th className="p-4 font-medium">المستوى</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-4 text-center text-gray-500">جاري التحميل...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="7" className="p-4 text-center text-gray-500">لا يوجد طلاب مطابقين للبحث</td></tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-600 font-medium">{student.university_id}</td>
                    <td className="p-4 text-gray-900 font-bold">{student.name}</td>
                    <td className="p-4 text-gray-600">{student.department}</td>
                    <td className="p-4 font-bold">{student.average}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${student.performance.color}-100 text-${student.performance.color}-700`}>
                        {student.performance.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.status.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {student.status.label}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center space-x-2 space-x-reverse">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentsManagement;
