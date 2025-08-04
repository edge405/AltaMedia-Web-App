const request = require('supertest');
const app = require('../src/server');

describe('Server Health Check', () => {
  test('GET /health should return server status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('environment');
  });
});

describe('Authentication Endpoints', () => {
  test('POST /api/auth/login should validate input', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Validation failed');
  });

  test('GET /api/auth/profile should require authentication', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .expect(401);

    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Access token required');
  });
}); 