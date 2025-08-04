const jwt = require('jsonwebtoken');
const pool = require('../../_db');

async function verify(req, res) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing token' });
    return null;
  }
  try {
    return jwt.verify(auth.replace('Bearer ', '').trim(), process.env.JWT_SECRET);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return null;
  }
}

module.exports = async function handler(req, res) {
  const user = await verify(req, res);
  if (!user) return;

  try {
    if (req.method === 'GET') {
      const { rows } = await pool.query('SELECT * FROM action_logs WHERE user_id=$1 ORDER BY timestamp DESC', [user.id]);
      res.json({ actionLogs: rows });
      return;
    }

    if (req.method === 'POST') {
      const { action, details, type } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO action_logs (user_id, action, details, type) VALUES ($1,$2,$3,$4) RETURNING *',
        [user.id, action, details, type]
      );
      res.status(201).json({ actionLog: rows[0] });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Action Logs error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 