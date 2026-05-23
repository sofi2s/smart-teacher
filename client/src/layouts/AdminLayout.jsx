import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, BrainCircuit, BookOpen, PenTool, MessageSquare, LogOut } from 'lucide-react';

function AdminLayout({ children, onLogout }) {
  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={20} />, label: 'لوحة القيادة' },
    { to: '/admin/students', icon: <Users size={20} />, label: 'إدارة الطلاب' },
    { to: '/admin/reports', icon: <BarChart3 size={20} />, label: 'التقارير والإحصائيات' },
    { to: '/admin/analysis', icon: <BrainCircuit size={20} />, label: 'التحليل الذكي' },
    { to: '/admin/lessons', icon: <BookOpen size={20} />, label: 'إدارة الدروس' },
    { to: '/admin/tests', icon: <PenTool size={20} />, label: 'الاختبارات الذكية' },
    { to: '/admin/chatbot', icon: <MessageSquare size={20} />, label: 'المساعد الذكي' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-primary">Smart Teacher</h1>
          <p className="text-sm text-gray-500 mt-1">لوحة تحكم المشرف</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
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

export default AdminLayout;
