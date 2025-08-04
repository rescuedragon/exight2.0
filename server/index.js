import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Exight API!',
    status: 'Server is running',
    endpoints: {
      health: '/health',
      test: '/test',
      api: '/api/hello',
      auth: '/api/auth',
      expenses: '/api/expenses'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint with database test
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    const pool = await import('./database/connection.js');
    const result = await pool.default.query('SELECT NOW() as current_time');
    
    res.json({ 
      status: 'OK', 
      message: 'Exight API is running',
      database: 'Connected',
      timestamp: new Date().toISOString(),
      db_time: result.rows[0].current_time
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working',
    timestamp: new Date().toISOString()
  });
});

// Simple API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ 
    message: 'Hello from Exight API!',
    timestamp: new Date().toISOString()
  });
});

// Import and use routes
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import actionLogRoutes from './routes/actionLogs.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/action-logs', actionLogRoutes);

// Initialize database endpoint
app.get('/api/init-db', async (req, res) => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const pool = await import('./database/connection.js');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Read the schema file
    const schemaPath = path.join(__dirname, './database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.default.query(schema);
    
    res.json({ 
      message: 'Database initialized successfully!',
      tables: ['users', 'expenses', 'partial_payments']
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({ 
      error: 'Database initialization failed',
      message: error.message 
    });
  }
});

// Import required modules
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Initialize database tables (only when needed)
async function initializeDatabase() {
  try {
    const pool = await import('./database/connection.js');
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Read the schema file
    const schemaPath = path.join(__dirname, './database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.default.query(schema);
    console.log('✅ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    console.log('⚠️  Continuing without database initialization...');
  }
}

// Initialize database on startup (but don't block server startup)
setTimeout(initializeDatabase, 1000);

// Simple test endpoint (no database required)
app.post('/api/auth/test', async (req, res) => {
  try {
    res.json({ 
      message: 'Auth endpoint working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Exight API server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app; 