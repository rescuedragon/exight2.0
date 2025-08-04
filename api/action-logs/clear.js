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
    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM action_logs WHERE user_id=$1', [user.id]);
      res.status(204).end();
      return;
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Clear logs error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 