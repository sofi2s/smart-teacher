import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, MessageCircle } from 'lucide-react';

function StudentChatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'أهلاً بك! أنا مساعدك الأكاديمي الذكي. يمكنك سؤالي عن أدائك، نقاط ضعفك، أو طلب نصائح للتحسين. (مثال: "ما هي نقاط ضعفي؟" أو "هل أنا مهدد بالرسوب؟")' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/chatbot/student', { message: userMessage, studentId: user?.studentId });
      setMessages(prev => [...prev, { sender: 'bot', text: response.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'عذراً، حدث خطأ أثناء الاتصال بالنظام.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-secondary p-4 text-white flex items-center space-x-3 space-x-reverse">
        <MessageCircle size={24} />
        <div>
          <h3 className="font-bold">المساعد الأكاديمي الذكي</h3>
          <p className="text-secondary-100 text-sm">مخصص لمتابعة مستواك (Rule-based AI)</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[80%] space-x-2 space-x-reverse ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600 mr-2' : 'bg-secondary/10 text-secondary ml-2'}`}>
                {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'}`}>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 space-x-reverse">
              <div className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center ml-2">
                <Bot size={18} />
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex space-x-1 space-x-reverse">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSend} className="flex space-x-2 space-x-reverse">
          <input
            type="text"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
            placeholder="اكتب سؤالك هنا..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || !user?.studentId}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !user?.studentId}
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center"
          >
            <Send size={20} className={document.documentElement.dir === 'rtl' ? 'rotate-180' : ''} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentChatbot;
