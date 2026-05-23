import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, BrainCircuit, Sparkles, MessageSquare } from 'lucide-react';

function AdminChatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'أهلاً بك يا أستاذي! أنا مساعدك الأكاديمي الذكي. يمكنني تحليل مستويات الطلاب، والتنبؤ بمخاطر الغياب والتحصيل، وتزويدك بنصائح مباشرة.\n\nيمكنك كتابة سؤالك مباشرة أو تجربة أحد الأسئلة المقترحة بالأسفل 👇' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "من هم الطلاب المتعثرون دراسياً؟",
    "حلل أداء الطالب أحمد محمد",
    "ما هي المواد الأكثر صعوبة لدى الطلاب؟",
    "اعطني نصيحة عامة لتحسين الحضور"
  ];

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/students');
      setStudents(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: messageText }]);
    setInput('');
    setLoading(true);

    try {
      let studentId = null;
      for (const student of students) {
        if (messageText.includes(student.name) || messageText.includes(student.university_id)) {
          studentId = student.id;
          break;
        }
      }

      const response = await axios.post('/chatbot/admin', { message: messageText, studentId });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'عذراً، حدث خطأ أثناء الاتصال بالنظام.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
      {/* Top Header Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-500/30">
            <BrainCircuit size={22} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm">المساعد الأكاديمي الذكي (AI Brain)</h3>
            <p className="text-[10px] text-slate-400">محلل البيانات وخبير التنبؤ السلوكي</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-[10px] bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-300 font-bold border border-slate-700/50">قاعدة ذكية نشطة</span>
        </div>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[75%] space-x-3 space-x-reverse ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'bg-white border border-slate-200 text-indigo-600 shadow-sm'
              }`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-3xl shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-wrap leading-relaxed text-xs font-medium">{msg.text}</div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="w-9 h-9 rounded-2xl bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shadow-sm">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center space-x-1.5 space-x-reverse">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips and Input Container */}
      <div className="p-5 bg-white border-t border-slate-100 space-y-4">
        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 justify-start items-center">
            <Sparkles size={14} className="text-amber-500 animate-spin" />
            <span className="text-[10px] font-bold text-slate-400 mr-1 ml-2">أسئلة مقترحة:</span>
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-[10px] font-bold text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 px-3.5 py-1.5 rounded-full smooth-transition hover:scale-[1.02]"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex space-x-3 space-x-reverse">
          <input
            type="text"
            className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-semibold placeholder-slate-400 smooth-transition"
            placeholder="اسأل المساعد الذكي عن الأداء الأكاديمي للطلاب، مثلاً: حلل أداء الطالب أحمد..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-7 rounded-2xl hover:shadow-lg hover:shadow-indigo-600/10 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <Send size={18} className={document.documentElement.dir === 'rtl' ? 'rotate-180' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminChatbot;
