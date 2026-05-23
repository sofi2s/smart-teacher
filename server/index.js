const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db/init');
const { seedDB } = require('./db/seed');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database, seed, and start server
async function startServer() {
  try {
    await initDB();
    seedDB();
    
    // Routes
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/students', require('./routes/students'));
    app.use('/api/stats', require('./routes/stats'));
    app.use('/api/lessons', require('./routes/lessons'));
    app.use('/api/questions', require('./routes/questions'));
    app.use('/api/tests', require('./routes/questions')); // Alias for test routes
    app.use('/api/analysis', require('./routes/analysis'));
    app.use('/api/chatbot', require('./routes/chatbot'));

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'Smart Teacher API is running' });
    });

    app.listen(PORT, () => {
      console.log(`\n🚀 Smart Teacher Server running on http://localhost:${PORT}`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();
