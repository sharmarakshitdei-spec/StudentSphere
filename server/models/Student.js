const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  admissionNumber: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  parentName: String,
  parentContact: String,
  address: String,
  dob: Date,
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  bloodGroup: String,
  sportsRecord: [{
    event: String,
    achievement: String,
    date: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Student', studentSchema);
