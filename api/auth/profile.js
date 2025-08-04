const jwt = require('jsonwebtoken');
const pool = require('../_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing token' });
    }
    const token = auth.replace('Bearer ', '').trim();
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userRes = await pool.query('SELECT id, email, first_name, last_name FROM users WHERE id=$1', [payload.id]);
    if (!userRes.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userRes.rows[0];
    res.json({ user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name } });
  } catch (err) {
    console.error('Profile error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 