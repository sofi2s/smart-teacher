import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AdminOverview from './AdminOverview';
import StudentsManagement from './StudentsManagement';
import ChartsReports from './ChartsReports';
import SmartAnalysis from './SmartAnalysis';
import LessonsManagement from './LessonsManagement';
import SmartTests from './SmartTests';
import AdminChatbot from './AdminChatbot';

function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<AdminOverview />} />
      <Route path="/students" element={<StudentsManagement />} />
      <Route path="/reports" element={<ChartsReports />} />
      <Route path="/analysis" element={<SmartAnalysis />} />
      <Route path="/lessons" element={<LessonsManagement />} />
      <Route path="/tests" element={<SmartTests />} />
      <Route path="/chatbot" element={<AdminChatbot />} />
    </Routes>
  );
}

export default AdminDashboard;
