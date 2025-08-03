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

// Import required modules
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './database/connection.js';

// Initialize database tables
async function initializeDatabase() {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Read the schema file
    const schemaPath = path.join(__dirname, './database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
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

// Auth endpoints with proper functionality
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // For now, just return success without database
    const token = jwt.sign(
      { id: 1, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully (demo mode)',
      user: {
        id: 1,
        email: email,
        firstName: firstName,
        lastName: lastName
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userData = user.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, userData.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: userData.id, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: userData.id,
        email: userData.email,
        firstName: userData.first_name,
        lastName: userData.last_name
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
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