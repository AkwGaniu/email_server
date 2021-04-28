const mongoose = require('mongoose')

const { Student } = require('../models/studentModel')
const application = new mongoose.Model({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Student
  },
  appType: {
    type: String,
    required: true
  },
  currentUni: {
    type: String,
    required: true
  },
  aspiringUni: {
    type: String,
    required: true
  },
  aspiringDept: {
    type: String,
    required: true
  },
  currentSession: {
    type: String,
    required: true
  },
  transferReason: {
    type: String,
    required: true
  },
})

module.exports.Application = mongoose.model('Application', application)