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

  const id = req.query.id; // vercel passes via query

  try {
    if (req.method === 'PUT') {
      const { name, amount, currency, type, deductionDay, isRecurring, remainingMonths, remainingAmount } = req.body;
      const { rows } = await pool.query(
        'UPDATE expenses SET name=$1, amount=$2, currency=$3, type=$4, deduction_day=$5, is_recurring=$6, remaining_months=$7, remaining_amount=$8 WHERE id=$9 AND user_id=$10 RETURNING *',
        [name, amount, currency, type, deductionDay, isRecurring, remainingMonths, remainingAmount, id, user.id]
      );
      return res.json({ expense: rows[0] });
    }

    if (req.method === 'DELETE') {
      await pool.query('DELETE FROM expenses WHERE id=$1 AND user_id=$2', [id, user.id]);
      return res.status(204).end();
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Expense id error', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 