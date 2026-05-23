import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Home, LineChart, Target, TrendingUp, BookOpen, PenTool, MessageCircle, LogOut, Compass, Sparkles } from 'lucide-react';

function StudentLayout({ children, onLogout, user }) {
  const navItems = [
    { to: '/student', icon: <Home size={18} />, label: 'الرئيسية' },
    { to: '/student/analysis', icon: <LineChart size={18} />, label: 'التحليل الأكاديمي' },
    { to: '/student/comparison', icon: <Target size={18} />, label: 'مقارنة الأداء' },
    { to: '/student/progress', icon: <TrendingUp size={18} />, label: 'التقدم والمعدل' },
    { to: '/student/lessons', icon: <BookOpen size={18} />, label: 'الدروس' },
    { to: '/student/tests', icon: <PenTool size={18} />, label: 'الاختبارات' },
    { to: '/student/chatbot', icon: <MessageCircle size={18} />, label: 'المساعد الذكي' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Student Premium Sidebar */}
      <aside className="w-68 bg-slate-900 shadow-2xl flex flex-col relative z-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="p-6 border-b border-slate-800 relative z-10 flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-wide">Smart Student</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5">بوابة الطالب الأكاديمية</p>
          </div>
        </div>

        {/* Student Profile details card */}
        <div className="p-4 mx-4 my-3 bg-purple-950/20 border border-purple-500/10 rounded-2xl flex flex-col space-y-2 relative z-10">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0) || 'ط'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-200 truncate">{user?.name || 'الطالب'}</h4>
              <span className="text-[10px] text-purple-400 font-medium">طالب مسجل</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-slate-800/80 pt-2 mt-1">
            <span>تخصص الذكاء الاصطناعي</span>
            <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold">نشط</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto relative z-10">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/student'}
              className={({ isActive }) =>
                `flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-xl smooth-transition ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-600/25 translate-x-1' 
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100 hover:translate-x-1'
                }`
              }
            >
              <span className="smooth-transition">{item.icon}</span>
              <span className="text-xs tracking-wider">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
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
        {/* Student Header */}
        <header className="h-16 bg-white border-b border-slate-100 shadow-sm flex items-center justify-between px-8 relative z-10">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Sparkles size={18} className="text-purple-500 animate-pulse" />
            <span className="text-sm font-semibold text-slate-500">نظام المتابعة الذاتية للأداء الأكاديمي</span>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <div className="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/50 text-[10px] font-bold text-slate-600">
              رقم الطالب الجامعي: <span className="text-purple-600">{user?.studentId || '2024001'}</span>
            </div>
          </div>
        </header>

        {/* Viewport content */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 relative">
          <div className="absolute top-20 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="p-8 max-w-7xl mx-auto w-full relative z-10">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
