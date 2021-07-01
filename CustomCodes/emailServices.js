const fs = require('fs')
"use strict";
const nodemailer = require("nodemailer");
const handlebars = require("handlebars")
const path = require("path");


const smtpTransport = nodemailer.createTransport({
  host: process.env.HOST,
  port: 465,  
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.PASS
  }
})

// verify connection configuration
smtpTransport.verify(function(error, success) {
  console.log(process.env.USER_EMAIL, process.env.PASS)

  if (error) { 
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const sendApplicationMail = (data) => {
  const emailTemplateSource = fs.readFileSync(path.join(__dirname, "../template/email_template.hbs"), "utf8")
  const template = handlebars.compile(emailTemplateSource)
  const htmlToSend = template(data)
  mailOptions = {
    from: process.env.USER,
    to: data.receivers,
    subject: data.subject,
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

module.exports = { sendApplicationMail }