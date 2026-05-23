import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, BrainCircuit, BookOpen, PenTool, MessageSquare, LogOut, Award, UserCheck } from 'lucide-react';

function AdminLayout({ children, onLogout }) {
  const user = JSON.parse(localStorage.getItem('user'));
  
  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'لوحة القيادة' },
    { to: '/admin/students', icon: <Users size={18} />, label: 'إدارة الطلاب' },
    { to: '/admin/reports', icon: <BarChart3 size={18} />, label: 'التقارير والإحصائيات' },
    { to: '/admin/analysis', icon: <BrainCircuit size={18} />, label: 'التحليل الذكي' },
    { to: '/admin/lessons', icon: <BookOpen size={18} />, label: 'إدارة الدروس' },
    { to: '/admin/tests', icon: <PenTool size={18} />, label: 'الاختبارات الذكية' },
    { to: '/admin/chatbot', icon: <MessageSquare size={18} />, label: 'المساعد الذكي' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Premium Sidebar */}
      <aside className="w-68 bg-slate-900 shadow-2xl flex flex-col relative z-20">
        {/* Glow behind Sidebar Top */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="p-6 border-b border-slate-800 relative z-10 flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">Smart Teacher</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5">لوحة تحكم الأستاذ</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-4 mx-4 my-3 bg-slate-800/40 border border-slate-800/60 rounded-2xl flex items-center space-x-3 space-x-reverse relative z-10">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
            {user?.name?.charAt(0) || 'أ'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-200 truncate">{user?.name || 'المشرف الرئيسي'}</h4>
            <div className="flex items-center space-x-1 space-x-reverse mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-400 font-medium">متصل الآن</span>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto relative z-10">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl smooth-transition ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-600/25 translate-x-1' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 hover:translate-x-1'
                }`
              }
            >
              <span className="smooth-transition">{item.icon}</span>
              <span className="text-xs tracking-wider">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout section */}
        <div className="p-4 border-t border-slate-800 relative z-10">
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 space-x-reverse px-4 py-3 w-full rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 smooth-transition"
          >
            <LogOut size={18} />
            <span className="text-xs font-bold">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 shadow-sm flex items-center justify-between px-8 relative z-10">
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm font-semibold text-slate-500">مرحباً بك مجدداً في لوحة التحكم الخاصة بك</span>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-slate-100 px-3 py-1.5 rounded-xl flex items-center space-x-2 space-x-reverse border border-slate-200/50">
              <UserCheck size={14} className="text-indigo-600" />
              <span className="text-[10px] font-bold text-slate-600">{user?.email}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Load Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 relative">
          {/* Subtle background glow decoration */}
          <div className="absolute top-20 right-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-fuchsia-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="p-8 max-w-7xl mx-auto w-full relative z-10">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
