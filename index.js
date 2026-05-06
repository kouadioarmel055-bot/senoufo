const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const motsRouter = require('./routes/mots.routes');
const authRouter = require('./routes/auth.routes');
const favoritesRouter = require('./routes/favorites.routes');
const progressRouter = require('./routes/progress.routes');
const dictionaryRouter = require('./routes/dictionary.routes');

// Import DB
const { pool } = require('./config/db');

// Routes
app.use('/api/mots', motsRouter); // Keep for backward compatibility
app.use('/api/auth', authRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/progress', progressRouter);
app.use('/api/dictionary', dictionaryRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Senoufo API is running',
    timestamp: new Date().toISOString()
  });
});

// API Info endpoint
app.get('/api/info', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }

  res.json({
    name: 'Senoufo API',
    version: '1.0.0',
    database: dbStatus,
    endpoints: {
      health: 'GET /health',
      mots: 'GET /api/mots',
      categories: 'GET /api/mots/categories',
      auth: 'GET /api/auth',
      favorites: 'GET /api/favorites',
      progress: 'GET /api/progress',
      dictionary: 'GET /api/dictionary'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path,
    method: req.method
  });
});

app.listen(PORT, async () => {
  console.log('');
  console.log('=====================================');
  console.log('Senoufo API Server');
  console.log('=====================================');
  console.log(`✓ Server running on port ${PORT}`);
  
  // Test DB connection
  try {
    await pool.query('SELECT 1');
    console.log('✓ Database connected successfully');
  } catch (err) {
    console.log('⚠ Database connection failed:', err.message);
  }
  
  console.log('=====================================');
  console.log('Available Endpoints:');
  console.log('  • GET /health - Server health check');
  console.log('  • GET /api/info - API information');
  console.log('  • GET /api/mots - All mots (with pagination)');
  console.log('  • GET /api/mots/categories - All categories');
  console.log('  • GET /api/auth - Authentication routes');
  console.log('  • GET /api/favorites - Favorites management');
  console.log('  • GET /api/progress - Progress tracking');
  console.log('  • GET /api/dictionary - Dictionary helper');
  console.log('=====================================');
  console.log('');
});
