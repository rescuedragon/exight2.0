import express from 'express';
import pool from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all expenses for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await pool.query(
      `SELECT 
        e.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pp.id,
              'amount', pp.amount,
              'paymentDate', pp.payment_date,
              'description', pp.description
            ) ORDER BY pp.payment_date DESC
          ) FILTER (WHERE pp.id IS NOT NULL), 
          '[]'::json
        ) as partial_payments
      FROM expenses e
      LEFT JOIN partial_payments pp ON e.id = pp.expense_id
      WHERE e.user_id = $1
      GROUP BY e.id
      ORDER BY e.created_at DESC`,
      [userId]
    );

    res.json({ expenses: expenses.rows });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single expense by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const expense = await pool.query(
      `SELECT 
        e.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pp.id,
              'amount', pp.amount,
              'paymentDate', pp.payment_date,
              'description', pp.description
            ) ORDER BY pp.payment_date DESC
          ) FILTER (WHERE pp.id IS NOT NULL), 
          '[]'::json
        ) as partial_payments
      FROM expenses e
      LEFT JOIN partial_payments pp ON e.id = pp.expense_id
      WHERE e.id = $1 AND e.user_id = $2
      GROUP BY e.id`,
      [id, userId]
    );

    if (expense.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense: expense.rows[0] });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      amount,
      currency = 'INR',
      type,
      deductionDay,
      isRecurring = true,
      totalMonths,
      remainingMonths,
      remainingAmount
    } = req.body;

    // Validate required fields
    if (!name || !amount || !type || !deductionDay) {
      return res.status(400).json({ 
        error: 'Name, amount, type, and deduction day are required' 
      });
    }

    // Validate type
    const validTypes = ['EMI', 'Personal Loan', 'Borrowed from Someone'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Type must be one of: EMI, Personal Loan, Borrowed from Someone' 
      });
    }

    // Validate deduction day
    if (deductionDay < 1 || deductionDay > 31) {
      return res.status(400).json({ 
        error: 'Deduction day must be between 1 and 31' 
      });
    }

    const newExpense = await pool.query(
      `INSERT INTO expenses (
        user_id, name, amount, currency, type, deduction_day, 
        is_recurring, total_months, remaining_months, remaining_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`,
      [userId, name, amount, currency, type, deductionDay, isRecurring, totalMonths, remainingMonths, remainingAmount]
    );

    res.status(201).json({ 
      message: 'Expense created successfully',
      expense: newExpense.rows[0]
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update expense
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const {
      name,
      amount,
      currency,
      type,
      deductionDay,
      isRecurring,
      totalMonths,
      remainingMonths,
      remainingAmount
    } = req.body;

    // Check if expense exists and belongs to user
    const existingExpense = await pool.query(
      'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingExpense.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Update expense
    const updatedExpense = await pool.query(
      `UPDATE expenses SET 
        name = COALESCE($1, name),
        amount = COALESCE($2, amount),
        currency = COALESCE($3, currency),
        type = COALESCE($4, type),
        deduction_day = COALESCE($5, deduction_day),
        is_recurring = COALESCE($6, is_recurring),
        total_months = COALESCE($7, total_months),
        remaining_months = COALESCE($8, remaining_months),
        remaining_amount = COALESCE($9, remaining_amount),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 AND user_id = $11
      RETURNING *`,
      [name, amount, currency, type, deductionDay, isRecurring, totalMonths, remainingMonths, remainingAmount, id, userId]
    );

    res.json({ 
      message: 'Expense updated successfully',
      expense: updatedExpense.rows[0]
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if expense exists and belongs to user
    const existingExpense = await pool.query(
      'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingExpense.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Delete expense (partial payments will be deleted automatically due to CASCADE)
    await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add partial payment to expense
router.post('/:id/payments', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { amount, paymentDate, description } = req.body;

    // Validate required fields
    if (!amount || !paymentDate) {
      return res.status(400).json({ 
        error: 'Amount and payment date are required' 
      });
    }

    // Check if expense exists and belongs to user
    const existingExpense = await pool.query(
      'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingExpense.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Add partial payment
    const newPayment = await pool.query(
      `INSERT INTO partial_payments (expense_id, amount, payment_date, description) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [id, amount, paymentDate, description]
    );

    res.status(201).json({ 
      message: 'Payment added successfully',
      payment: newPayment.rows[0]
    });
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete partial payment
router.delete('/:id/payments/:paymentId', authenticateToken, async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    const userId = req.user.id;

    // Check if expense exists and belongs to user
    const existingExpense = await pool.query(
      'SELECT * FROM expenses WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingExpense.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Delete payment
    const deletedPayment = await pool.query(
      'DELETE FROM partial_payments WHERE id = $1 AND expense_id = $2 RETURNING *',
      [paymentId, id]
    );

    if (deletedPayment.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 