// Simple feedback API for Exight
// Exposes POST /api/feedback and sends an email via Hostinger SMTP

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

// Respect reverse proxy (for correct req.ip and protocol)
app.set('trust proxy', true);

// Security headers
app.use(helmet());

// Optional HTTPS enforcement and HSTS
const ENFORCE_HTTPS = String(process.env.ENFORCE_HTTPS || 'false').toLowerCase() === 'true';
const ENABLE_HSTS = String(process.env.ENABLE_HSTS || 'false').toLowerCase() === 'true';

if (ENFORCE_HTTPS) {
  app.use((req, res, next) => {
    const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
    if (proto !== 'https') {
      const host = req.headers.host;
      const url = `https://${host}${req.originalUrl}`;
      return res.redirect(301, url);
    }
    next();
  });
}

if (ENABLE_HSTS) {
  app.use((req, res, next) => {
    // Set HSTS only when the request is already HTTPS to avoid mixed-mode issues
    const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
    if (proto === 'https') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    next();
  });
}
app.use(compression());
app.use(express.json({ limit: '256kb' }));

// --- Structured access logging (JSON) with daily file output ---
const logsDir = path.join(__dirname, 'logs');
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (_) {
  // If logs directory cannot be created, fallback to stdout-only
}

function getAccessLogStream() {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const filePath = path.join(logsDir, `access-${date}.log`);
  try {
    return fs.createWriteStream(filePath, { flags: 'a' });
  } catch (_) {
    // Fallback to process.stdout if file stream fails
    return process.stdout;
  }
}

let accessLogStream = getAccessLogStream();

// Allow manual rotation (e.g., kill -HUP <pid>)
process.on('SIGHUP', () => {
  try {
    if (accessLogStream && accessLogStream !== process.stdout) {
      accessLogStream.end();
    }
  } catch (_) {}
  accessLogStream = getAccessLogStream();
});

// JSON formatter for morgan
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

// Strict CORS (5.4): allow only configured origins
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

// --- Consistent error helper ---
const errorBody = (code, message, details) => ({ error: { code, message, details } });

// --- Very small, dependency-free rate limiter ---
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
      return res.status(429).json(
        errorBody('RATE_LIMITED', 'Too many requests. Try again later.', {
          retryAfterSec: retryAfter,
        }),
      );
    }
    next();
  };
}

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

// Auth settings
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// In-memory user registry (email → user)
const users = new Map();

// Utility to create JWT
function mintToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.firstName + ' ' + (user.lastName || '') },
    JWT_SECRET,
    { expiresIn: '7d' },
  );
}

// POST /api/auth/google — verify Google ID token and issue app JWT
app.post('/api/auth/google', async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) {
      return res.status(400).json(errorBody('MISSING_TOKEN', 'idToken is required'));
    }

    // Verify via Google tokeninfo endpoint
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

    // Normalize names
    const firstName = info.given_name || (info.name ? String(info.name).split(' ')[0] : 'User');
    const lastName = info.family_name || '';

    // Upsert in memory
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

// GET /api/auth/me — decode JWT and return user basics
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

// Validation schema
const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(160, 'Email too long')
    .optional()
    .or(z.literal('').transform(() => undefined)),
  message: z.string().trim().min(5, 'Message too short').max(4000, 'Message too long'),
});

// Basic HTML escape to prevent injection in emails
const escapeHtml = (unsafe) =>
  String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

// POST /api/feedback
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

// --- Minimal OpenAPI document & docs route ---
const openApiDoc = {
  openapi: '3.0.3',
  info: {
    title: 'Exight Feedback API',
    version: '1.0.0',
    description: 'Minimal OpenAPI spec for feedback and health endpoints',
  },
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    service: { type: 'string' },
                    time: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/feedback': {
      post: {
        summary: 'Submit feedback',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', maxLength: 100 },
                  email: { type: 'string', format: 'email', maxLength: 160 },
                  message: { type: 'string', minLength: 5, maxLength: 4000 },
                },
                required: ['message'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Feedback accepted',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { success: { type: 'boolean' } } },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'object',
                      properties: {
                        code: { type: 'string' },
                        message: { type: 'string' },
                        details: { type: 'array', items: { type: 'object' } },
                      },
                    },
                  },
                },
              },
            },
          },
          429: {
            description: 'Rate limited',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'object',
                      properties: { code: { type: 'string' }, message: { type: 'string' } },
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'object',
                      properties: { code: { type: 'string' }, message: { type: 'string' } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/google': {
      post: {
        summary: 'Authenticate with Google ID token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { idToken: { type: 'string' } },
                required: ['idToken'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { token: { type: 'string' }, user: { type: 'object' } },
                },
              },
            },
          },
          400: { description: 'Missing or invalid token' },
          401: { description: 'Verification failed' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        summary: 'Return current user from JWT',
        responses: { 200: { description: 'OK' }, 401: { description: 'Invalid token' } },
      },
    },
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

// --- Centralized error handler (structured) ---
// Keep at the end, after all routes
// eslint-disable-next-line no-unused-vars
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

// Start server only when executed directly (not during tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Feedback API listening on http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;
