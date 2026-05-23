import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/stats/overview');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (!stats) return <div className="text-red-500">حدث خطأ في تحميل الإحصائيات</div>;

  const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 space-x-reverse border border-gray-100">
      <div className={`p-3 rounded-full ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );

  const pieData = {
    labels: ['ناجح', 'راسب'],
    datasets: [
      {
        data: [stats.passed, stats.failed],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: stats.deptStats.map(d => d.department),
    datasets: [
      {
        label: 'متوسط الدرجات',
        data: stats.deptStats.map(d => d.average),
        backgroundColor: '#4f46e5',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">نظرة عامة على الأداء</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي الطلاب" 
          value={stats.totalStudents} 
          icon={<Users size={24} className="text-blue-600" />} 
          colorClass="bg-blue-100" 
        />
        <StatCard 
          title="المتوسط العام" 
          value={`${stats.generalAvg}%`} 
          icon={<GraduationCap size={24} className="text-purple-600" />} 
          colorClass="bg-purple-100" 
        />
        <StatCard 
          title="نسبة النجاح" 
          value={`${Math.round((stats.passed / (stats.passed + stats.failed || 1)) * 100)}%`} 
          icon={<CheckCircle2 size={24} className="text-green-600" />} 
          colorClass="bg-green-100" 
        />
        <StatCard 
          title="نسبة الحضور" 
          value={`${stats.avgAttendance?.attendancePercent || 0}%`} 
          icon={<AlertCircle size={24} className="text-orange-600" />} 
          colorClass="bg-orange-100" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Pass/Fail Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">نسبة النجاح والرسوب</h3>
          <div className="h-64 flex justify-center">
            <Pie 
              data={pieData} 
              options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} 
            />
          </div>
        </div>

        {/* Department Averages Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">متوسط الأداء حسب التخصص</h3>
          <div className="h-64">
            <Bar 
              data={barData} 
              options={{ 
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, max: 100 } }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
