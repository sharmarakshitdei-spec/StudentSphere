const express = require('express');
const router = express.Router();
const { getStudentDashboard, applyLeave, updateProfile } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply protection to all routes below
router.get('/dashboard', protect, authorize('student'), getStudentDashboard);
router.post('/leave', protect, authorize('student'), applyLeave);
router.put('/profile', protect, authorize('student'), updateProfile);

module.exports = router;
