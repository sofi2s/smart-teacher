import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, MessageCircle, Sparkles } from 'lucide-react';

function StudentChatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'أهلاً بك! أنا مساعدك الأكاديمي الشخصي. يمكنني تزويدك بتقرير عن نقاط قوتك وضعفك، وحالة الغياب والتحصيل الدراسي، واقتراح طرق للتحسين.\n\nاضغط على أي استفسار مقترح بالأسفل لبدء التحليل 👇' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const studentSuggestions = [
    "ما هي نقاط قوتي؟",
    "ما هي نقاط الضعف لدي؟",
    "هل أنا مهدد بالرسوب أو في دائرة الخطر؟",
    "اعطني نصائح لتحسين درجاتي"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (messageText) => {
    if (!messageText.trim() || !user?.studentId) return;

    setMessages(prev => [...prev, { sender: 'user', text: messageText }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/chatbot/student', { message: messageText, studentId: user?.studentId });
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
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/30">
            <MessageCircle size={22} className="animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm">مستشارك الأكاديمي الشخصي</h3>
            <p className="text-[10px] text-slate-400">إرشادات مبنية على نتائجك الدراسية وحضورك</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping"></span>
          <span className="text-[10px] bg-slate-800/80 px-2.5 py-1 rounded-full text-slate-300 font-bold border border-slate-700/50">دعم الطالب نشط</span>
        </div>
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[75%] space-x-3 space-x-reverse ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10' 
                  : 'bg-white border border-slate-200 text-purple-600 shadow-sm'
              }`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-3xl shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-tr-none' 
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
              <div className="w-9 h-9 rounded-2xl bg-white border border-slate-200 text-purple-600 flex items-center justify-center shadow-sm">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center space-x-1.5 space-x-reverse">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
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
            <span className="text-[10px] font-bold text-slate-400 mr-1 ml-2">اسألني عن:</span>
            {studentSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-[10px] font-bold text-purple-700 bg-purple-50/50 hover:bg-purple-50 border border-purple-100/50 px-3.5 py-1.5 rounded-full smooth-transition hover:scale-[1.02]"
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
            className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-xs font-semibold placeholder-slate-400 smooth-transition"
            placeholder="اكتب سؤالك هنا بخصوص أدائك الجامعي أو درجاتك..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || !user?.studentId}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !user?.studentId}
            className="bg-purple-600 hover:bg-purple-500 text-white px-7 rounded-2xl hover:shadow-lg hover:shadow-purple-600/10 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            <Send size={18} className={document.documentElement.dir === 'rtl' ? 'rotate-180' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentChatbot;
