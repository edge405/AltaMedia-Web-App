const request = require('supertest');
const app = require('../src/server');

describe('User Package API', () => {
  describe('POST /api/user-package/create-user-with-package', () => {
    it('should create a user with package successfully', async () => {
      const userData = {
        email: `test-${Date.now()}@example.com`,
        fullname: 'Test User',
        phone_number: '1234567890',
        package_name: 'Test Package',
        expiration_date: '2024-12-31',
        total_amount: 199.99,
        features: [
          {
            feature_name: 'Logo Design',
            description: 'Custom logo creation',
            status: 'pending',
            progress: 0
          },
          {
            feature_name: 'Brand Guidelines',
            description: 'Complete brand style guide',
            status: 'pending',
            progress: 0
          }
        ]
      };

      const response = await request(app)
        .post('/api/user-package/create-user-with-package')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user_id).toBeDefined();
      expect(response.body.data.purchased_package_with_features_id).toBeDefined();
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.fullname).toBe(userData.fullname);
      expect(response.body.data.package.package_name).toBe(userData.package_name);
      expect(response.body.data.package.features).toHaveLength(2);
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        fullname: 'Test User',
        phone_number: '1234567890',
        package_name: 'Test Package',
        expiration_date: '2024-12-31',
        total_amount: 199.99
      };

      // First request should succeed
      await request(app)
        .post('/api/user-package/create-user-with-package')
        .send(userData)
        .expect(201);

      // Second request with same email should fail
      const response = await request(app)
        .post('/api/user-package/create-user-with-package')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should reject invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        fullname: 'Test User',
        phone_number: '1234567890',
        package_name: 'Test Package',
        expiration_date: '2024-12-31',
        total_amount: 199.99
      };

      const response = await request(app)
        .post('/api/user-package/create-user-with-package')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject missing required fields', async () => {
      const userData = {
        email: 'test@example.com',
        fullname: 'Test User'
        // Missing phone_number, package_name, expiration_date, total_amount
      };

      const response = await request(app)
        .post('/api/user-package/create-user-with-package')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Missing required fields');
    });

    it('should create user without features', async () => {
      const userData = {
        email: `test-no-features-${Date.now()}@example.com`,
        fullname: 'Test User No Features',
        phone_number: '1234567890',
        package_name: 'Basic Package',
        expiration_date: '2024-12-31',
        total_amount: 99.99
        // No features array
      };

      const response = await request(app)
        .post('/api/user-package/create-user-with-package')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.package.features).toHaveLength(0);
    });
  });
});
