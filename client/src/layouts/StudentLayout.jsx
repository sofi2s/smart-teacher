import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, LineChart, Target, TrendingUp, BookOpen, PenTool, MessageCircle, LogOut } from 'lucide-react';

function StudentLayout({ children, onLogout, user }) {
  const navItems = [
    { to: '/student', icon: <Home size={20} />, label: 'الرئيسية' },
    { to: '/student/analysis', icon: <LineChart size={20} />, label: 'التحليل الشخصي' },
    { to: '/student/comparison', icon: <Target size={20} />, label: 'مقارنة الأداء' },
    { to: '/student/progress', icon: <TrendingUp size={20} />, label: 'التقدم الأكاديمي' },
    { to: '/student/lessons', icon: <BookOpen size={20} />, label: 'الدروس' },
    { to: '/student/tests', icon: <PenTool size={20} />, label: 'الاختبارات' },
    { to: '/student/chatbot', icon: <MessageCircle size={20} />, label: 'المساعد الذكي' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-secondary/5">
          <h1 className="text-2xl font-bold text-secondary">Smart Student</h1>
          <p className="text-sm text-gray-600 mt-2 font-medium">مرحباً، {user?.name}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/student'}
              className={({ isActive }) =>
                `flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-secondary/10 text-secondary font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 space-x-reverse px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default StudentLayout;
