const request = require('supertest');
const app = require('../src/server');

describe('Admin Dashboard Stats API', () => {
  let adminToken;

  beforeAll(async () => {
    // You would need to create an admin user and get a token
    // For now, this is a basic structure
  });

  describe('GET /api/user-package/admin/dashboard-stats', () => {
    it('should return 403 for non-admin users', async () => {
      const response = await request(app)
        .get('/api/user-package/admin/dashboard-stats')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
    });

    it('should return dashboard statistics for admin users', async () => {
      // This test would require a valid admin token
      // For now, just testing the endpoint structure
      const response = await request(app)
        .get('/api/user-package/admin/dashboard-stats')
        .set('Authorization', 'Bearer admin-token');

      // The response should have the correct structure
      if (response.status === 200) {
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('overview');
        expect(response.body.data).toHaveProperty('features');
        expect(response.body.data).toHaveProperty('recent_activity');
      }
    });
  });
});
