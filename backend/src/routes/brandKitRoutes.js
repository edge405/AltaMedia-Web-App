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

// Form Progress Routes (Primary routes for step-by-step form handling)
router.put('/progress', authenticateToken, updateFormProgress); // Update form step by step
router.get('/progress', authenticateToken, getBrandKitForm);    // Get current form data

// Complete Form Routes
router.post('/', authenticateToken, createOrUpdateBrandKitForm); // Create/update complete form
router.delete('/', authenticateToken, deleteBrandKitForm);       // Delete form

// Admin routes (require admin role)
router.get('/admin/all', authenticateToken, requireRole(['admin']), getAllBrandKitForms);
router.get('/admin/:id', authenticateToken, requireRole(['admin']), getBrandKitFormById);

module.exports = router; 