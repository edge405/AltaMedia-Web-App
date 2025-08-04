const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  createOrUpdateBrandKitForm,
  getBrandKitForm,
  updateFormProgress,
  getAllBrandKitForms,
  getBrandKitFormById,
  deleteBrandKitForm
} = require('../controllers/brandKitController');

// User routes (require authentication)
router.post('/', authenticateToken, createOrUpdateBrandKitForm);
router.get('/', authenticateToken, getBrandKitForm);
router.put('/', authenticateToken, updateFormProgress);
router.delete('/', authenticateToken, deleteBrandKitForm);

// Admin routes (require admin role)
router.get('/admin/all', authenticateToken, requireRole(['admin']), getAllBrandKitForms);
router.get('/admin/:id', authenticateToken, requireRole(['admin']), getBrandKitFormById);

module.exports = router; 