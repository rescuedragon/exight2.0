const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../_db');

module.exports = async function handler(req, res) {
  console.log('[Register API] Function invoked.');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Register API] Request body:', JSON.stringify(req.body, null, 2));
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      console.error('[Register API] Validation failed: Missing email or password.');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 8) {
      console.error('[Register API] Validation failed: Password is less than 8 characters.');
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    console.log(`[Register API] Checking for existing user with email: ${email}`);
    const existing = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.rows.length > 0) {
      console.warn(`[Register API] User already exists with email: ${email}`);
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    console.log(`[Register API] User with email ${email} does not exist. Proceeding.`);

    console.log('[Register API] Hashing password...');
    const hash = await bcrypt.hash(password, 10);
    console.log('[Register API] Password hashing complete.');

    console.log('[Register API] Inserting new user into database...');
    const inserted = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id, email, first_name, last_name',
      [email, hash, firstName || null, lastName || null]
    );
    const user = inserted.rows[0];
    console.log('[Register API] New user inserted successfully:', JSON.stringify(user));

    if (!process.env.JWT_SECRET) {
      console.error('[Register API] CRITICAL: JWT_SECRET environment variable is not set!');
      throw new Error('JWT secret is not configured on the server.');
    }

    console.log('[Register API] Generating JWT...');
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log('[Register API] JWT generation successful.');

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    });
  } catch (err) {
    console.error('[Register API] A critical error occurred:', err);
    console.error('[Register API] Error Stack:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 