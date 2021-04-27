const mongoose = require('mongoose')

const faculty = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  }
})

module.exports.Faculty = mongoose.model('Faculty', faculty)