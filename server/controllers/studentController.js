const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const User = require('../models/User');

// @desc    Get student profile and dashboard data
// @route   GET /api/student/dashboard
// @access  Private/Student
const Assignment = require('../models/Assignment');
const LeaveApplication = require('../models/LeaveApplication');

// @desc    Get student dashboard
const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const attendance = await Attendance.find({ student: student._id });
    const results = await Result.find({ student: student._id });
    const assignments = await Assignment.find({ class: student.class, department: student.department });
    const leaves = await LeaveApplication.find({ student: student._id });

    // AI Rule-based Recommendation
    const recommendations = [];
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const totalDays = attendance.length;
    const attendanceRate = totalDays > 0 ? (presentCount / totalDays) * 100 : 100;
    
    if (attendanceRate < 75) {
      recommendations.push({
        type: 'warning',
        message: 'Focus on attendance! Your current rate is below 75%.',
        focus: 'Attendance'
      });
    }

    results.forEach(res => {
      if (res.marks < 40) {
        recommendations.push({
          type: 'improvement',
          message: `Need improvement in ${res.subject}. Your score is below 40%.`,
          focus: res.subject
        });
      }
    });

    res.json({
      student,
      attendance,
      results,
      assignments,
      leaves,
      attendanceRate: attendanceRate.toFixed(2),
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply for leave
// @route   POST /api/student/leave
// @access  Private/Student
const applyLeave = async (req, res) => {
  const { reason, startDate, endDate } = req.body;
  try {
    const student = await Student.findOne({ user: req.user._id });
    const leave = await LeaveApplication.create({
      student: student._id,
      reason,
      startDate,
      endDate,
    });
    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, class: className, admissionNumber } = req.body;
  try {
    let student = await Student.findOne({ user: req.user._id });
    
    // If student doesn't exist, create it!
    if (!student) {
      student = new Student({
        user: req.user._id,
        admissionNumber: admissionNumber || `STU${Date.now()}`,
        class: className || 'Not Assigned',
        department: 'General'
      });
    } else {
      // Update Student details
      if (className) student.class = className;
      if (admissionNumber) student.admissionNumber = admissionNumber;
    }
    
    // Update User name
    if (name) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.name = name;
        await user.save();
      }
    }

    await student.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update Profile Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Roll Number already exists! Please use a unique one.' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudentDashboard,
  applyLeave,
  updateProfile,
};
