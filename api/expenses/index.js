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
      const { rows } = await pool.query('SELECT * FROM expenses WHERE user_id=$1', [user.id]);
      res.json({ expenses: rows });
      return;
    }

    if (req.method === 'POST') {
      const { name, amount, currency = 'INR', type, deductionDay, isRecurring, totalMonths } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO expenses (user_id, name, amount, currency, type, deduction_day, is_recurring, total_months, remaining_months, remaining_amount) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,$3*$8) RETURNING *',
        [user.id, name, amount, currency, type, deductionDay, isRecurring, totalMonths || null]
      );
      res.status(201).json({ expense: rows[0] });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Expenses error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 