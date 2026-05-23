import React from 'react';
import { Routes, Route } from 'react-router-dom';

import StudentOverview from './StudentOverview';
import StudentAnalysis from './StudentAnalysis';
import StudentLessons from './StudentLessons';
import StudentTests from './StudentTests';
import StudentChatbot from './StudentChatbot';

function StudentDashboard() {
  return (
    <Routes>
      <Route path="/" element={<StudentOverview />} />
      <Route path="/analysis" element={<StudentAnalysis />} />
      <Route path="/comparison" element={<div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100"><h2 className="text-2xl font-bold mb-4">مقارنة الأداء</h2><p>قريباً...</p></div>} />
      <Route path="/progress" element={<div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100"><h2 className="text-2xl font-bold mb-4">التقدم الأكاديمي</h2><p>قريباً...</p></div>} />
      <Route path="/lessons" element={<StudentLessons />} />
      <Route path="/tests" element={<StudentTests />} />
      <Route path="/chatbot" element={<StudentChatbot />} />
    </Routes>
  );
}

export default StudentDashboard;
