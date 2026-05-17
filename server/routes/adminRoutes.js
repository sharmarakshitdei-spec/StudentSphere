const express = require('express');
const router = express.Router();
const {
  addStudent,
  addTeacher,
  getStudents,
  getTeachers,
  getAdminStats,
  getDepartments,
  getAllAttendance,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.route('/students').post(addStudent).get(getStudents);
router.route('/teachers').post(addTeacher).get(getTeachers);
router.get('/departments', getDepartments);
router.get('/attendance', getAllAttendance);
router.get('/stats', getAdminStats);

module.exports = router;
