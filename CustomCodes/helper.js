const { Student } = require('../models/studentModel')


const validEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  if(regex.test(email) === false) {
    return false
  } else{
    return true
  }
}

const fetchUserDetails = async (matricNumber) => {
  try {
    const studentData = await Student.findOne({ matricNumber: matricNumber }).populate('department')
    console.log(studentData)
    const returnData = {
      studentData: studentData
    }
    return returnData
  } catch (error) {
    console.log({ Environment_error: error.toString() })
  }
}

module.exports = { validEmail, fetchUserDetails }