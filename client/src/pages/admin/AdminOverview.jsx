import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, GraduationCap, Calendar, Award, ArrowUpRight, TrendingUp, TrendingDown, BookOpen } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-500 font-medium">جاري جلب إحصائيات النظام...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
        حدث خطأ في تحميل إحصائيات النظام الأكاديمي.
      </div>
    );
  }

  const StatCard = ({ title, value, icon, gradient, change, isPositive }) => (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-3xl shadow-xl p-6 text-white smooth-transition hover:scale-[1.02] hover:shadow-2xl`}>
      {/* Decorative inner circle */}
      <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
      
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
          {icon}
        </div>
        {change && (
          <span className="flex items-center space-x-1 space-x-reverse text-xs font-bold bg-white/15 px-2.5 py-1 rounded-full">
            <span>{change}</span>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          </span>
        )}
      </div>

      <div className="mt-6">
        <p className="text-white/70 text-xs font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black mt-1">{value}</h3>
      </div>
    </div>
  );

  const pieData = {
    labels: ['نسبة النجاح', 'نسبة الرسوب أو التعثر'],
    datasets: [
      {
        data: [stats.passed, stats.failed],
        backgroundColor: ['#6366f1', '#f43f5e'],
        hoverBackgroundColor: ['#4f46e5', '#e11d48'],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: stats.deptStats.map(d => d.department),
    datasets: [
      {
        label: 'متوسط درجات الطلاب في القسم',
        data: stats.deptStats.map(d => d.average),
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        hoverBackgroundColor: '#4f46e5',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800">الرئيسية والإحصائيات</h2>
          <p className="text-slate-500 text-sm mt-1">تابع أداء ومعدلات تحصيل جميع الطلاب بشكل لحظي عبر الذكاء الأكاديمي.</p>
        </div>
        <div className="bg-white border border-slate-200/60 shadow-sm px-4 py-2 rounded-2xl flex items-center space-x-2 space-x-reverse">
          <Calendar size={16} className="text-indigo-600" />
          <span className="text-xs font-bold text-slate-600">الفصل الدراسي الحالي: الأول 2024</span>
        </div>
      </div>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="إجمالي الطلاب المسجلين" 
          value={stats.totalStudents} 
          icon={<Users size={20} />} 
          gradient="from-indigo-600 to-indigo-800" 
          change="+12% الشهر الحالي"
          isPositive={true}
        />
        <StatCard 
          title="المعدل التراكمي العام" 
          value={`${stats.generalAvg}%`} 
          icon={<GraduationCap size={20} />} 
          gradient="from-purple-600 to-purple-800" 
          change="مستقر"
          isPositive={true}
        />
        <StatCard 
          title="معدل النجاح الكلي" 
          value={`${Math.round((stats.passed / (stats.passed + stats.failed || 1)) * 100)}%`} 
          icon={<Award size={20} />} 
          gradient="from-emerald-600 to-emerald-800" 
          change="+4% عن العام السابق"
          isPositive={true}
        />
        <StatCard 
          title="نسبة التزام الحضور" 
          value={`${stats.avgAttendance?.attendancePercent || 0}%`} 
          icon={<BookOpen size={20} />} 
          gradient="from-amber-600 to-amber-800" 
          change="-2% الأسبوع الأخير"
          isPositive={false}
        />
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pass/Fail Pie Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100/60 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">حالة النجاح الأكاديمي</h3>
            <p className="text-slate-400 text-xs mt-1">توزيع أداء الطلاب العام بالنسبة لمتطلبات النجاح.</p>
          </div>
          <div className="h-60 mt-6 flex justify-center items-center">
            <Pie 
              data={pieData} 
              options={{ 
                maintainAspectRatio: false, 
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { family: 'Tajawal', size: 11 } } 
                  } 
                } 
              }} 
            />
          </div>
        </div>

        {/* Department Averages Bar Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100/60 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">معدلات الأداء للأقسام الأكاديمية</h3>
            <p className="text-slate-400 text-xs mt-1">مقارنة متوسط التحصيل والنتائج بين التخصصات المختلفة.</p>
          </div>
          <div className="h-60 mt-6">
            <Bar 
              data={barData} 
              options={{ 
                maintainAspectRatio: false,
                scales: { 
                  y: { beginAtZero: true, max: 100, ticks: { font: { family: 'Tajawal', size: 10 } } },
                  x: { ticks: { font: { family: 'Tajawal', size: 10 } } }
                },
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Quick Action list & smart insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="text-sm font-black text-indigo-900 flex items-center space-x-1.5 space-x-reverse">
            <span>تحليل أداء الأقسام</span>
          </h4>
          <p className="text-indigo-800/70 text-xs mt-1">
            مستوى الطلاب في تخصص "الذكاء الاصطناعي" هو الأعلى بنسبة 93.75٪ هذا الفصل الدراسي.
          </p>
        </div>
        <a 
          href="/admin/analysis"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 space-x-reverse shadow-md shadow-indigo-600/10 transition-all"
        >
          <span>تصفح التحليل الذكي للطلاب</span>
          <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}

export default AdminOverview;
