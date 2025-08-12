// Simple feedback API for Exight (CommonJS build for tests)
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.set('trust proxy', true);

app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '256kb' }));

const logsDir = path.join(__dirname, 'logs');
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (_) {}

function getAccessLogStream() {
  const date = new Date().toISOString().slice(0, 10);
  const filePath = path.join(logsDir, `access-${date}.log`);
  try {
    return fs.createWriteStream(filePath, { flags: 'a' });
  } catch (_) {
    return process.stdout;
  }
}

let accessLogStream = getAccessLogStream();
process.on('SIGHUP', () => {
  try {
    if (accessLogStream && accessLogStream !== process.stdout) {
      accessLogStream.end();
    }
  } catch (_) {}
  accessLogStream = getAccessLogStream();
});

const jsonFormat = (tokens, req, res) => {
  const status = Number(tokens.status(req, res)) || 0;
  const length = Number(tokens.res(req, res, 'content-length') || 0);
  const rt = Number(tokens['response-time'](req, res)) || 0;
  const ref = req.headers.referer || undefined;
  const ua = req.headers['user-agent'] || undefined;
  const ip = req.ip || req.connection?.remoteAddress || undefined;
  return (
    JSON.stringify({
      time: new Date().toISOString(),
      level: status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info',
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status,
      responseTimeMs: rt,
      contentLength: length,
      ip,
      referrer: ref,
      userAgent: ua,
    }) + '\n'
  );
};

app.use(
  morgan(jsonFormat, {
    stream: accessLogStream,
    skip: () => process.env.NODE_ENV === 'test',
  }),
);

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'https://dev.exight.in')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin))) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const errorBody = (code, message, details) => ({ error: { code, message, details } });

function createRateLimiter({ windowMs = 60_000, max = 5 }) {
  const buckets = new Map();
  return function rateLimit(req, res, next) {
    const key = req.ip || req.headers['x-forwarded-for'] || 'anon';
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, ts: now };
    if (now - bucket.ts > windowMs) {
      bucket.count = 0;
      bucket.ts = now;
    }
    bucket.count += 1;
    buckets.set(key, bucket);
    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.ts + windowMs - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res
        .status(429)
        .json(errorBody('RATE_LIMITED', 'Too many requests. Try again later.', { retryAfterSec: retryAfter }));
    }
    next();
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'feedback-api', time: new Date().toISOString() });
});

const SMTP_USER = process.env.SMTP_USER || 'feedback@exight.in';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com';
const SMTP_PORT = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const users = new Map();

function mintToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.firstName + ' ' + (user.lastName || '') },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) {
      return res.status(400).json(errorBody('MISSING_TOKEN', 'idToken is required'));
    }
    const infoResp = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
    );
    if (!infoResp.ok) {
      return res.status(401).json(errorBody('INVALID_GOOGLE_TOKEN', 'Google token is invalid'));
    }
    const info = await infoResp.json();
    if (GOOGLE_CLIENT_ID && info.aud !== GOOGLE_CLIENT_ID) {
      return res.status(401).json(errorBody('AUDIENCE_MISMATCH', 'Google token audience mismatch'));
    }
    const email = info.email;
    const emailVerified = info.email_verified === 'true' || info.email_verified === true;
    if (!email || !emailVerified) {
      return res.status(401).json(errorBody('EMAIL_NOT_VERIFIED', 'Email not verified'));
    }
    const firstName = info.given_name || (info.name ? String(info.name).split(' ')[0] : 'User');
    const lastName = info.family_name || '';
    const existing = users.get(email);
    const user =
      existing ||
      (() => {
        const u = { id: String(Date.now()), firstName, lastName, email };
        users.set(email, u);
        return u;
      })();
    const token = mintToken(user);
    return res.json({ token, user });
  } catch (err) {
    console.error('Google auth failed', err);
    return res.status(500).json(errorBody('SERVER_ERROR', 'Google auth failed'));
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json(errorBody('NO_TOKEN', 'No token'));
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;
    const user = users.get(email) || {
      id: decoded.id,
      firstName: decoded.name?.split(' ')[0],
      lastName: '',
      email,
    };
    return res.json({ user });
  } catch (e) {
    return res.status(401).json(errorBody('INVALID_TOKEN', 'Invalid token'));
  }
});

const feedbackSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name too long').optional().or(z.literal('').transform(() => undefined)),
  email: z.string().trim().email('Invalid email address').max(160, 'Email too long').optional().or(z.literal('').transform(() => undefined)),
  message: z.string().trim().min(5, 'Message too short').max(4000, 'Message too long'),
});

const escapeHtml = (unsafe) =>
  String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

app.post('/api/feedback', createRateLimiter({ windowMs: 60_000, max: 5 }), async (req, res) => {
  try {
    const parse = feedbackSchema.safeParse(req.body || {});
    if (!parse.success) {
      return res.status(400).json(
        errorBody(
          'VALIDATION_ERROR',
          'Invalid input',
          parse.error.issues.map((i) => ({ path: i.path, message: i.message })),
        ),
      );
    }
    const { name, email, message } = parse.data;
    const text = message.trim();
    const html = `
      <p><strong>New feedback from Exight</strong></p>
      <p><strong>Name:</strong> ${escapeHtml(name || '(not provided)')}<br/>
      <strong>Email:</strong> ${escapeHtml(email || '(not provided)')}
      </p>
      <p>${escapeHtml(text).replace(/\n/g, '<br/>')}</p>
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
    res.status(500).json(errorBody('SERVER_ERROR', 'Failed to send feedback'));
  }
});

const openApiDoc = {
  openapi: '3.0.3',
  info: { title: 'Exight Feedback API', version: '1.0.0', description: 'Minimal OpenAPI spec for feedback and health endpoints' },
  paths: {
    '/api/health': { get: { summary: 'Health check', responses: { 200: { description: 'OK' } } } },
    '/api/feedback': { post: { summary: 'Submit feedback' } },
    '/api/auth/google': { post: { summary: 'Authenticate with Google ID token' } },
    '/api/auth/me': { get: { summary: 'Return current user from JWT' } },
  },
};

app.get('/api/openapi.json', (_req, res) => {
  res.type('application/json').send(JSON.stringify(openApiDoc, null, 2));
});

app.get('/api/docs', (_req, res) => {
  res.type('html').send(`<!doctype html>
  <html>
    <head><meta charset="utf-8" /><title>Exight API Docs</title></head>
    <body>
      <redoc spec-url="/api/openapi.json"></redoc>
      <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
    </body>
  </html>`);
});

app.use((err, req, res, _next) => {
  try {
    const payload = {
      time: new Date().toISOString(),
      level: 'error',
      message: err?.message || 'Unhandled error',
      stack: process.env.NODE_ENV === 'production' ? undefined : err?.stack,
      path: req.originalUrl,
      method: req.method,
    };
    const line = JSON.stringify(payload) + '\n';
    if (accessLogStream && accessLogStream !== process.stdout) {
      accessLogStream.write(line);
    } else {
      process.stderr.write(line);
    }
  } catch (_) {}
  res.status(500).json(errorBody('SERVER_ERROR', 'Internal server error'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Feedback API listening on http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;


