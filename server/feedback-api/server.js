// Simple feedback API for Exight
// Exposes POST /api/feedback and sends an email via Hostinger SMTP

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '256kb' }));
app.use(morgan('tiny'));

// Health check (used for quick verification)
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'feedback-api', time: new Date().toISOString() });
});

// SMTP transporter (Hostinger)
const SMTP_USER = process.env.SMTP_USER || 'feedback@exight.in';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for 587
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// POST /api/feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    const text = (message || '').trim();
    if (!text || text.length < 5) {
      return res.status(400).json({ success: false, message: 'Message too short' });
    }
    const html = `
      <p><strong>New feedback from Exight</strong></p>
      <p><strong>Name:</strong> ${name || '(not provided)'}<br/>
      <strong>Email:</strong> ${email || '(not provided)'}
      </p>
      <p>${text.replace(/\n/g, '<br/>')}</p>
    `;
    await transporter.sendMail({
      from: `Exight Feedback <${SMTP_USER}>`,
      to: 'feedback@exight.in',
      subject: 'Exight Feedback',
      replyTo: email || SMTP_USER,
      html,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Feedback send failed:', err);
    res.status(500).json({ success: false, message: 'Failed to send feedback' });
  }
});

app.listen(PORT, () => {
  console.log(`Feedback API listening on http://127.0.0.1:${PORT}`);
});
