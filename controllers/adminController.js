const userFunction = require('../CustomCodes/userFunctions')
const helperFunctions = require('../CustomCodes/helper')
const { Department } = require('../models/departmentModel')
const { Faculty } = require('../models/facultyModel')

module.exports.addStudent = async (req, resp, next) => {
  try {
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const middleName = req.body.middleName
    const email = req.body.email
    const department = req.body.department
    const matricNumber = req.body.matricNumber
    const cgpa = req.body.cgpa
    const level =  req.body.level
    const entryMode = req.body.entryMode
    const entryYear = req.body.entryYear
  
    if (firstName && lastName && department && matricNumber && cgpa && level && entryMode && entryYear) {
      const passport = `http://studentservices.lasu.edu.ng/returningstudents/images/stud_image/${matricNumber}.jpg`
      const userData = {
        matricNumber: matricNumber,
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        email: email,
        cgpa: cgpa,
        level: level,
        department: department,
        entryMode: entryMode,
        entryYear: entryYear,
        passport: passport
      }
      const { response, data } = await userFunction.registrationProcess(userData)
      if (response) {
        const responseData = { Error: 0, Message: 'Registration successful' }
        return resp.status(200).json(responseData)
      } else {
        const error = new Error(data)
        error.status = 200
        next(error)
      }
    } else {
      const error = new Error('Invalid parameter')
      error.status = 400
      next(error)
    }  
  } catch (error) {
    console.log({Environment_error: error.toString()})
    error.status = 500
    next(error)
  }
}

module.exports.addDepartment = async (req, resp, next) => {
  try {
    const deptName = req.body.deptName
    const faculty = req.body.faculty
    if (deptName && faculty) {
      const department = await Department.findOne({ deptName: deptName.toLowerCase() })
      if (!department) {
        const existingFaculty = await Faculty.findOne({ name: faculty.toLowerCase() })
        const newDepartment = new Department({
          deptName: deptName.toLowerCase(),
          faculty: existingFaculty._id
        })
        await newDepartment.save()
        const responseData = { Error: 0, Message: 'Department added successfully', data: newDepartment }
        return resp.json(responseData)
      } else {
        const error = new Error('Department already exist')
        error.status = 200
        next(error)
      }
    } else {
      const error = new Error('Invalid parameters')
      error.status = 400
      next(error)
    }  
  } catch (error) {
    console.log({Environment_error: error.toString()})
    error.status = 500
    next(error)
  }
}

module.exports.addFaculty = async (req, resp, next) => {
  try {
    const name = req.body.name
    if (name) {
      const faculty = await Faculty.findOne({ name: name.toLowerCase() })
      if (!faculty) {
        const newFaculty = new Faculty({
          name: name.toLowerCase(),
        })
        await newFaculty.save()
        const responseData = { Error: 0, Message: 'faculty added successfully', data: newFaculty }
        return resp.json(responseData)
      } else {
        const error = new Error('Faculty already exist')
        error.status = 400
        next(error)
      }
    } else {
      const error = new Error('Invalid parameters')
      error.status = 400
      next(error)
    }  
  } catch (error) {
    console.log({Environment_error: error.toString()})
    error.status = 500
    next(error)
  }
}


module.exports.fetchStudent = async (req, resp, next) => {
  try {
    const matricNumber = req.body.matricNumber
    if (matricNumber) {
      const userDetails = await helperFunctions.fetchUserDetails(matricNumber)
      if(userDetails) {
        const responseData = { Error: 0, Message: 'success', data: userDetails}
        return resp.status(200).json(responseData)
      } else {
        const error = new Error('OoPs, something ocurred')
        error.status = 200
        next(error)
      }
    } else {
      const error = new Error('No matric number supplied')
      error.status = 200
      next(error)
    }
  } catch (error) {
    console.log({ Environment_error: error.toString() })
    next(error.toString())
  }
}


module.exports.fetchFaculties = async (req, resp, next) => {
  try {
    const faculties = await helperFunctions.fetchFaculties()
    if(faculties) {
      const responseData = { Error: 0, Message: 'success', data: faculties}
      return resp.status(200).json(responseData)
    } else {
      const error = new Error('OoPs, something ocurred')
      error.status = 200
      next(error)
    }
  } catch (error) {
    console.log({ Environment_error: error.toString() })
    next(error.toString())
  }
}