import React, { useState } from 'react';
import axios from 'axios';
import { LogIn, Sparkles, BookOpen, ShieldAlert } from 'lucide-react';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', { email, password });
      onLogin(response.data.user, response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من الشبكة أو الخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full bg-fuchsia-500/10 blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>

      <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-3xl shadow-2xl relative z-10 border border-white/10">
        <div>
          <div className="mx-auto h-20 w-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transform hover:rotate-12 smooth-transition">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-8 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            Smart Teacher
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500 font-medium">
            نظام التحليل الأكاديمي والتعليم الذكي المتكامل
          </p>
        </div>
        
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-xl text-sm flex items-center space-x-2 space-x-reverse">
              <ShieldAlert className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 mr-1">البريد الإلكتروني</label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3.5 bg-slate-100/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 smooth-transition"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 mr-1">كلمة المرور</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3.5 bg-slate-100/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 smooth-transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحقق...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <LogIn className="h-4 w-4" />
                  <span>دخول المنصة</span>
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 border-t border-slate-200/60 pt-6">
          <div className="flex items-center space-x-2 space-x-reverse mb-4 text-slate-600">
            <Sparkles size={16} className="text-purple-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider">حسابات تجريبية سريعة:</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => { setEmail('admin@smart.edu'); setPassword('admin123'); }}
              className="bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-right cursor-pointer smooth-transition hover:scale-[1.02]"
            >
              <span className="font-bold text-xs text-indigo-700 block mb-1">المشرف الأكاديمي (الاستاذ)</span>
              <span className="text-[10px] text-slate-500 block truncate">admin@smart.edu</span>
            </div>
            <div 
              onClick={() => { setEmail('student@smart.edu'); setPassword('student123'); }}
              className="bg-purple-50/50 hover:bg-purple-50 border border-purple-100 p-3 rounded-xl text-right cursor-pointer smooth-transition hover:scale-[1.02]"
            >
              <span className="font-bold text-xs text-purple-700 block mb-1">حساب الطالب</span>
              <span className="text-[10px] text-slate-500 block truncate">student@smart.edu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
