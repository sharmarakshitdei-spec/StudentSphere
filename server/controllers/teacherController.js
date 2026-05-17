const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const Assignment = require('../models/Assignment');
const LeaveApplication = require('../models/LeaveApplication');
const sendNotification = require('../utils/notificationHelper');

// @desc    Get teacher profile and assigned students
const getMyStudents = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id });
    if (!teacher) return res.status(404).json({ message: 'Teacher profile not found' });
    const students = await Student.find({ department: teacher.department }).populate('user', 'name email');
    res.json({ teacher, students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance
const markAttendance = async (req, res) => {
  const { studentId, subject, status, date } = req.body;
  try {
    const teacher = await Teacher.findOne({ user: req.user._id });
    const student = await Student.findById(studentId).populate('user');
    
    const attendance = await Attendance.create({
      student: studentId,
      teacher: teacher._id,
      subject,
      status,
      date: date || new Date(),
    });

    if (status === 'Absent') {
      await sendNotification(
        req.io,
        student.user._id,
        'Attendance Alert',
        `You were marked Absent for ${subject} on ${new Date(date || new Date()).toLocaleDateString()}`,
        'warning'
      );
    }

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add results
const addResult = async (req, res) => {
  const { studentId, subject, marks, totalMarks, remarks } = req.body;
  try {
    const student = await Student.findById(studentId).populate('user');
    const percentage = (marks / totalMarks) * 100;
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 40) grade = 'D';

    const result = await Result.create({
      student: studentId,
      subject,
      marks,
      totalMarks,
      grade,
      remarks,
    });

    await sendNotification(
      req.io,
      student.user._id,
      'New Result Uploaded',
      `Your marks for ${subject} have been uploaded. Grade: ${grade}`,
      'success'
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Compare two students
const compareStudents = async (req, res) => {
  const { student1Id, student2Id } = req.body;
  try {
    const s1 = await Student.findById(student1Id).populate('user', 'name');
    const s2 = await Student.findById(student2Id).populate('user', 'name');
    const s1Attendance = await Attendance.find({ student: student1Id });
    const s2Attendance = await Attendance.find({ student: student2Id });
    const s1Results = await Result.find({ student: student1Id });
    const s2Results = await Result.find({ student: student2Id });

    res.json({
      student1: {
        name: s1.user.name,
        attendanceRate: s1Attendance.length > 0 ? (s1Attendance.filter(a => a.status === 'Present').length / s1Attendance.length) * 100 : 0,
        avgMarks: s1Results.length > 0 ? s1Results.reduce((acc, curr) => acc + curr.marks, 0) / s1Results.length : 0,
        results: s1Results
      },
      student2: {
        name: s2.user.name,
        attendanceRate: s2Attendance.length > 0 ? (s2Attendance.filter(a => a.status === 'Present').length / s2Attendance.length) * 100 : 0,
        avgMarks: s2Results.length > 0 ? s2Results.reduce((acc, curr) => acc + curr.marks, 0) / s2Results.length : 0,
        results: s2Results
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add an assignment
const addAssignment = async (req, res) => {
  const { subject, title, description, deadline, studentClass } = req.body;
  try {
    const teacher = await Teacher.findOne({ user: req.user._id });
    const assignment = await Assignment.create({
      teacher: teacher._id,
      subject,
      title,
      description,
      deadline,
      department: teacher.department,
      class: studentClass,
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leave applications
const getLeaveApplications = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user: req.user._id });
    const studentsInDept = await Student.find({ department: teacher.department }).select('_id');
    const studentIds = studentsInDept.map(s => s._id);
    const leaves = await LeaveApplication.find({ student: { $in: studentIds } }).populate({
      path: 'student',
      populate: { path: 'user', select: 'name' }
    });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update leave status
const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await LeaveApplication.findById(req.params.id).populate({
      path: 'student',
      populate: { path: 'user' }
    });
    if (!leave) return res.status(404).json({ message: 'Leave application not found' });
    leave.status = req.body.status;
    await leave.save();

    await sendNotification(
      req.io,
      leave.student.user._id,
      `Leave ${req.body.status}`,
      `Your leave application for ${new Date(leave.startDate).toLocaleDateString()} has been ${req.body.status.toLowerCase()}.`,
      req.body.status === 'Approved' ? 'success' : 'error'
    );

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyStudents,
  markAttendance,
  addResult,
  compareStudents,
  addAssignment,
  getLeaveApplications,
  updateLeaveStatus,
};
