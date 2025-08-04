const jwt = require('jsonwebtoken');
const pool = require('../../../_db');

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
  const expenseId = req.query.id;

  try {
    if (req.method === 'POST') {
      const { amount, paymentDate, description } = req.body;
      const { rows } = await pool.query(
        'INSERT INTO partial_payments (expense_id, amount, payment_date, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [expenseId, amount, paymentDate, description]
      );
      // after payment, update remaining months and amount
      await pool.query(
        'UPDATE expenses SET remaining_months = remaining_months - 1, remaining_amount = remaining_amount - $1 WHERE id=$2',
        [amount, expenseId]
      );
      res.status(201).json({ payment: rows[0] });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Payments error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 