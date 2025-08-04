import express from 'express';
import pool from '../database/connection.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all action logs for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const logs = await pool.query(
      `SELECT * FROM action_logs 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 100`,
      [userId]
    );

    res.json(logs.rows);
  } catch (error) {
    console.error('Get action logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new action log
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { action, details, type } = req.body;

    // Validate required fields
    if (!action || !details || !type) {
      return res.status(400).json({ 
        error: 'Action, details, and type are required' 
      });
    }

    // Validate type
    const validTypes = ['add', 'update', 'payment', 'delete'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        error: 'Type must be one of: add, update, payment, delete' 
      });
    }

    const newLog = await pool.query(
      `INSERT INTO action_logs (user_id, action, details, type) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [userId, action, details, type]
    );

    res.status(201).json(newLog.rows[0]);
  } catch (error) {
    console.error('Create action log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete action log
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if log exists and belongs to user
    const existingLog = await pool.query(
      'SELECT * FROM action_logs WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (existingLog.rows.length === 0) {
      return res.status(404).json({ error: 'Action log not found' });
    }

    // Delete log
    await pool.query(
      'DELETE FROM action_logs WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    res.json({ message: 'Action log deleted successfully' });
  } catch (error) {
    console.error('Delete action log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear all action logs for user
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      'DELETE FROM action_logs WHERE user_id = $1',
      [userId]
    );

    res.json({ message: 'All action logs cleared successfully' });
  } catch (error) {
    console.error('Clear action logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;