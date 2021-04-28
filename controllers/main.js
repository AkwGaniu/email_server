const emailService = require("../CustomCodes/emailServices");


// const smtpTransport = nodemailer.createTransport({
//   service: process.env.HOST,
//   auth: {
//     user: process.env.USER,
//     pass: process.env.PASS
//   }
// })

module.exports.home = (req, resp, next) => {
  console.log(req.device)
  resp.status(200).json({
    error: 0,
    message: 'Successful, Welcome.'
  })
}

module.exports.sendMail =  async (req, resp, next) => {
  try {
    const receiver = req.body.to
    const subject = req.body.subject
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const phoneNum = req.body.phoneNum
    const studentEmail = req.body.studentEmail
    const appType = req.body.applicationType
    const currentDept = req.body.currentDept
    const currentUni = req.body.currentUni
    const matricNum = req.body.matricNum
    const aspiringUni = req.body.aspiringUni
    const aspiringDept = req.body.aspiringDept
    const entryMode = req.body.entryMode
    const entryYear = req.body.entryYear
    const currentSession = req.body.currentSession
    const transferReason = req.body.transferReason
    const now = Date.now()
    const today = new Date(now)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let date = `${today.getDate()} ${months[today.getMonth()]}, ${today.getFullYear()}`
    
    if (receiver && subject && firstName && lastName && phoneNum && studentEmail &&
      appType && currentDept && currentUni && matricNum && aspiringUni && aspiringDept &&
      entryMode && entryYear && currentSession && transferReason) {
        const appData = {
          firstName: firstName,
          lastName: lastName,
          phoneNum: phoneNum,
          studentEmail: studentEmail,
          appType: appType,
          currentUni: currentUni,
          currentDept: currentDept,
          matricNum: matricNum,
          aspiringUni: aspiringUni,
          aspiringDept: aspiringDept,
          entryMode: entryMode,
          entryYear: entryYear,
          currentSession: currentSession,
          transferReason: transferReason,
          passport: result.url
        }
        emailService.sendApplicationMail(appData)
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