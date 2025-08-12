// Basic endpoint tests for feedback API
const assert = require('assert');
const supertest = require('supertest');
const path = require('path');

// Ensure env suitable for tests
process.env.NODE_ENV = 'test';
process.env.ALLOWED_ORIGINS = '*';
process.env.JWT_SECRET = 'test-secret';
process.env.SMTP_USER = 'feedback@exight.in';
process.env.SMTP_PASS = 'dummy';
process.env.SMTP_HOST = 'smtp.hostinger.com';
process.env.SMTP_PORT = '465';

// Load app after env
const app = require(path.join('..', 'server.js'));
const request = supertest(app);

describe('feedback-api', () => {
  it('GET /api/health → 200', async () => {
    const res = await request.get('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.ok, true);
    assert.strictEqual(res.body.service, 'feedback-api');
  });

  it('POST /api/feedback validation', async () => {
    const res = await request
      .post('/api/feedback')
      .set('Content-Type', 'application/json')
      .send({ message: 'hi' }); // too short
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error);
    assert.strictEqual(res.body.error.code, 'VALIDATION_ERROR');
  });
});
