const emailService = require("../CustomCodes/emailServices");
const { Student } = require("../models/studentModel")
const { Application } = require("../models/applicationModel")

module.exports.home = (req, resp, next) => {
  console.log(req.device)
  resp.status(200).json({
    error: 0,
    message: 'Successful, Welcome.'
  })
}

module.exports.sendMail =  async (req, resp, next) => {
  try {
    const authorizedEmail = req.body.to
    const subject = req.body.subject
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const phoneNum = req.body.phoneNum
    const studentEmail = req.body.studentEmail
    const appType = req.body.applicationType
    const currentDept = req.body.currentDept
    const currentUni = req.body.currentUni
    const matricNumber = req.body.matricNumber
    const aspiringUni = req.body.aspiringUni
    const aspiringDept = req.body.aspiringDept
    const entryMode = req.body.entryMode
    const entryYear = req.body.entryYear
    const currentSession = req.body.currentSession
    const transferReason = req.body.transferReason

    if (authorizedEmail && subject && firstName && lastName && phoneNum && studentEmail &&
      appType && currentDept && currentUni && matricNumber && aspiringUni && aspiringDept &&
      entryMode && entryYear && currentSession && transferReason) {
        const receivers = [ authorizedEmail, studentEmail ]

      const passport = `http://studentservices.lasu.edu.ng/returningstudents/images/stud_image/${matricNumber}.jpg`
      const applicationData = {
        firstName: firstName,
        lastName: lastName,
        phoneNum: phoneNum,
        studentEmail: studentEmail,
        appType: appType,
        currentUni: currentUni,
        currentDept: currentDept,
        matricNumber: matricNumber,
        aspiringUni: aspiringUni,
        aspiringDept: aspiringDept,
        entryMode: entryMode,
        entryYear: entryYear,
        currentSession: currentSession,
        transferReason: transferReason,
        passport: passport,
        receivers: receivers
      }
      emailService.sendApplicationMail(applicationData)
      const studentRef = Student.findOne({ matricNumber: matricNumber })
      const newApplication = new Application({
        student: studentRef._id,
        appType: appType,
        currentUni: currentUni,
        aspiringUni: aspiringUni,
        aspiringDept: aspiringDept,
        currentSession: currentSession,
        transferReason: transferReason
      })
      newApplication.save()
      resp.json('Application sent successfully')
    } else {
      const err = new Error('Invalid parameter')
      err.status = 400
      return next(err)
    }
  } catch (error) {
    // console.log(error)
    const err = new Error(error)
    next(err)
  }
}