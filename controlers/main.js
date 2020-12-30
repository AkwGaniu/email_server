const fs = require('fs')
const cloudinary = require('cloudinary')
"use strict";
const nodemailer = require("nodemailer");
const handlebars = require("handlebars")
const path = require("path");


const emailTemplateSource = fs.readFileSync(path.join(__dirname, "../template/email_template.hbs"), "utf8")
console.log(process.env.HOST)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_SECRET_KEY 
});

const smtpTransport = nodemailer.createTransport({
  service: process.env.HOST,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

const template = handlebars.compile(emailTemplateSource)

module.exports.home = (req, resp, next) => {
  resp.status(200).json({
    error: 0,
    message: "Success"
  })
}

module.exports.sendMail =  async (req, resp, next) => {
  try {
    const reciever = req.body.to
    const subject = req.body.subject
    const firstName = req.body.firstName
    const lastName = req.body.lastName
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
    
    if (reciever && subject && firstName && lastName &&
      appType && currentDept && currentUni && matricNum && 
      aspiringUni && aspiringDept && entryMode && entryYear && 
      currentSession && transferReason) {
      if (req.files && req.files.passport) {
        const passportFile = req.files.passport
        const file_name = passportFile.name
        const file_path = './uploads/' + file_name
        const allowed_files = [".jpeg", ".JPEG", ".jpg", ".JPG", ".PNG", ".png", ".svg"]
        const start = file_name.indexOf(".")
        const file_type = file_name.slice(start, file_name.length)
        if (allowed_files.includes(file_type)) {
          passportFile.mv(file_path, async (err) => {
            if (err) next(err)
            cloudinary.v2.uploader.upload(file_path, (error, result) => {
              fs.unlinkSync(file_path)
              if (error) return next(error)

              const htmlToSend = template({
                firstName: firstName,
                lastName: lastName,
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
              })
              const mailOptions = {
                from: process.env.USER,
                to: reciever,
                subject: subject,
                html: htmlToSend
              }
              smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                  console.log(error)
                  const err = new Error(error)
                  return next(err)
                } else {
                  resp.status(200).json({
                    error: 0,
                    message: 'mail sent'
                  })
                }
              })
            })
          })
        } else {
          const err = new Error('Image format not supported')
          err.status = 401
          return next(err)
        }
      } else {
        const err = new Error('No passport attached')
        err.status = 400
        return next(err)
      }
    } else {
      const err = new Error('Invalid parameter')
      err.status = 400
      return next(err)
    }
  } catch (error) {
    console.log(error)
    const err = new Error(error)
    next(err)
  }
}