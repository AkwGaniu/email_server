const helperFunction = require('../CustomCodes/helper')
const { Student } = require('../models/studentModel')

const registrationProcess = async (studentData) => {
  try {
    if (!helperFunction.validEmail(studentData.email)) return { response: false, data: 'Invalid Email address' }
    const user = await Student.findOne({ email: studentData.matricNumber })
    if (!!user) {
      return { response: false, data: 'A user with that matriculation number already exist' }
    } else {
      const newUser = new Student(studentData)
      savedUser = await newUser.save()
      return { response: true, data: savedUser }
    }
  } catch (error) {
    console.log(error.toString())
    return { response: false, data: 'Some error occurred' }
  }
}

module.exports = {
  registrationProcess,
}