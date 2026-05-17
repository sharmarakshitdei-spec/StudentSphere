const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');

// @desc    Add a student
// @route   POST /api/admin/students
// @access  Private/Admin
const addStudent = async (req, res) => {
  const { name, email, password, admissionNumber, department, studentClass } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
    });

    const student = await Student.create({
      user: user._id,
      admissionNumber,
      department,
      class: studentClass,
    });

    res.status(201).json({ user, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a teacher
// @route   POST /api/admin/teachers
// @access  Private/Admin
const addTeacher = async (req, res) => {
  const { name, email, password, employeeId, department } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name,
      email,
      password,
      role: 'teacher',
    });

    const teacher = await Teacher.create({
      user: user._id,
      employeeId,
      department,
    });

    res.status(201).json({ user, teacher });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('user', 'name email');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    
    // For now, these are 0 or empty until we have data
    res.json({
      totalStudents,
      totalTeachers,
      avgAttendance: 0, 
      attendanceData: [],
      performanceData: [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get department statistics
// @route   GET /api/admin/departments
// @access  Private/Admin
const getDepartments = async (req, res) => {
  try {
    const students = await Student.find();
    const teachers = await Teacher.find();

    // Dynamically aggregate counts by department
    const deptMap = {};

    students.forEach((s) => {
      const dept = s.department || 'Not Assigned';
      if (!deptMap[dept]) {
        deptMap[dept] = { name: dept, students: 0, teachers: 0 };
      }
      deptMap[dept].students += 1;
    });

    teachers.forEach((t) => {
      const dept = t.department || 'Not Assigned';
      if (!deptMap[dept]) {
        deptMap[dept] = { name: dept, students: 0, teachers: 0 };
      }
      deptMap[dept].teachers += 1;
    });

    const result = Object.values(deptMap);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get school-wide attendance logs
// @route   GET /api/admin/attendance
// @access  Private/Admin
const getAllAttendance = async (req, res) => {
  try {
    const logs = await Attendance.find()
      .populate({
        path: 'student',
        populate: { path: 'user', select: 'name email' }
      })
      .populate({
        path: 'teacher',
        populate: { path: 'user', select: 'name' }
      })
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addStudent,
  addTeacher,
  getStudents,
  getTeachers,
  getAdminStats,
  getDepartments,
  getAllAttendance,
};
