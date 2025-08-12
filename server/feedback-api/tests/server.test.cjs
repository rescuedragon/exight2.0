const assert = require('assert');
const test = require('node:test');
const supertest = require('supertest');
const path = require('path');

process.env.NODE_ENV = 'test';
process.env.ALLOWED_ORIGINS = '*';
process.env.JWT_SECRET = 'test-secret';
process.env.SMTP_USER = 'feedback@exight.in';
process.env.SMTP_PASS = 'dummy';
process.env.SMTP_HOST = 'smtp.hostinger.com';
process.env.SMTP_PORT = '465';

// Use CommonJS build for tests to avoid ESM boundary issues
const app = require(path.join('..', 'server.cjs'));
const request = supertest(app);

test('GET /api/health → 200', async () => {
  const res = await request.get('/api/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.ok, true);
  assert.strictEqual(res.body.service, 'feedback-api');
});

test('POST /api/feedback validation', async () => {
  const res = await request
    .post('/api/feedback')
    .set('Content-Type', 'application/json')
    .send({ message: 'hi' });
  assert.strictEqual(res.status, 400);
  assert.ok(res.body.error);
  assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
});


