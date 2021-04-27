const fs = require('fs')
"use strict";
const nodemailer = require("nodemailer");
const handlebars = require("handlebars")
const path = require("path");


// const smtpTransport = nodemailer.createTransport({
//   host: process.env.HOST,
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.USER,
//     pass: process.env.PASS,
//   }
// })
// console.log(process.env.HOST, process.env.USER, process.env.PASS )

const smtpTransport = nodemailer.createTransport({
  host: 'mail.phoenixlogisticsng.com',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@phoenixlogisticsng.com',
    pass: '(Phoenix1#)'
  }
})

// verify connection configuration
// smtpTransport.verify(function(error, success) {
//   if (error) { 
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

const sendPasswordResetMail = (data) => {
const emailTemplateSource = fs.readFileSync(path.join(__dirname, "../template/mail/passwordReset.hbs"), "utf8")
const template = handlebars.compile(emailTemplateSource)

  const htmlToSend = template({
    email: data.email,
    username: data.username,
    validationUrl: data.url
  })

  const mailOptions = {
    from: process.env.USER,
    to: data.email,
    subject: "Password Reset",
    html: htmlToSend
  }
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error)
      return false
    } else {
      return true
    }
  })
}


const sendLeaveRequestMail = (data) => {
  const emailTemplateSource = fs.readFileSync(path.join(__dirname, "../template/mail/leaveRequest.hbs"), "utf8")
  const template = handlebars.compile(emailTemplateSource)
    const htmlToSend = template({
      email: data.email,
      username: data.username,
      validationUrl: data.url
    })    
    const mailOptions = {
      from: process.env.USER,
      to: data.email,
      subject: "Password Reset",
      html: htmlToSend
    }
    smtpTransport.sendMail(mailOptions, function(error, response) {
      if (error) {
        console.log(error)
        return false
      } else {
        return true
      }
    })
  }

module.exports = { sendPasswordResetMail, sendLeaveRequestMail }