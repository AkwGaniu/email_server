const { Student } = require('../models/studentModel')
const { Faculty } = require('../models/facultyModel')
const { Department } = require('../models/departmentModel')


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
    const faculty = await  Faculty.findOne({ _id: studentData.department.faculty })
    const returnData = {
      firstName: studentData.firstName,
      middleName: studentData.middleName,
      lastName: studentData.lastName,
      level: studentData.level,
      cgpa: studentData.cgpa,
      matricNumber: studentData.matricNumber,
      email: studentData.email,
      entryMode: studentData.entryMode,
      entryYear: studentData.entryYear,
      department: studentData.department.deptName,
      faculty: faculty.name,
      passport: studentData.passport
    }
    // console.log(returnData)
    return returnData
  } catch (error) {
    console.log({ Environment_error: error.toString() })
  }
}

const fetchFaculties = async (matricNumber) => {
  try {
    const faculties = await  Faculty.find({})
    const departments = await  Department.find({})
    let newFaculties = []
    let newFaculty
    for (faculty of faculties) {
      newFaculty = {
        name: faculty.name,
        departments: []
      }
      for (department of departments) {
        console.log(faculty._id, department.faculty)
        if (faculty._id.toString() === department.faculty.toString()) {
          newFaculty.departments.push(department.deptName)
        }
      }
      newFaculties.push(newFaculty)
    }
    return newFaculties
  } catch (error) {
    console.log({ Environment_error: error.toString() })
  }
}

module.exports = { validEmail, fetchUserDetails, fetchFaculties }