const express = require('express');
const router = express.Router();
const {
  getMyStudents,
  markAttendance,
  addResult,
  compareStudents,
  addAssignment,
  getLeaveApplications,
  updateLeaveStatus,
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('teacher'));

router.get('/students', getMyStudents);
router.post('/attendance', markAttendance);
router.post('/results', addResult);
router.post('/compare', compareStudents);
router.post('/assignments', addAssignment);
router.get('/leaves', getLeaveApplications);
router.put('/leaves/:id', updateLeaveStatus);

module.exports = router;
