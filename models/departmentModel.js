const mongoose = require('mongoose')

const faculty = require('./facultyModel')

const department = new mongoose.Schema({
  deptName: {
    type: String,
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: faculty.Faculty
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
})

module.exports.Department = mongoose.model('Department', department)