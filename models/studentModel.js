const mongoose = require('mongoose')

const department = require('./departmentModel')

const student = new mongoose.Schema({
  matricNumber: {
    type: String,
    max: 9,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    default: null
  },
  middleName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  level: {
    type: String,
    default: null
  },
  cgpa: {
    type: String,
    default: null
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: department.Department,
    required: true
  },
  entryMode: {
    type: String,
    required: true
  },
  entryYear: {
    type: String,
    required: true
  },
  passport: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
})

module.exports.Student = mongoose.model('Students', student)