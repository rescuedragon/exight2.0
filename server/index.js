import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Exight API is running',
    timestamp: new Date().toISOString()
  });
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

// Simple auth endpoints (temporary)
app.post('/api/auth/register', async (req, res) => {
  try {
    res.json({ 
      message: 'Registration endpoint working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    res.json({ 
      message: 'Login endpoint working',
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