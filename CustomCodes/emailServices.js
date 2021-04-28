const fs = require('fs')
"use strict";
const nodemailer = require("nodemailer");
const handlebars = require("handlebars")
const path = require("path");


const smtpTransport = nodemailer.createTransport({
  service: process.env.HOST,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
})

// verify connection configuration
smtpTransport.verify(function(error, success) {
  if (error) { 
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const sendApplicationMail = (data) => {
  const emailTemplateSource = fs.readFileSync(path.join(__dirname, "../template/mail/passwordReset.hbs"), "utf8")
  const template = handlebars.compile(emailTemplateSource)
  const htmlToSend = template(data)
  mailOptions = {
    from: process.env.USER,
    to: receiver,
    subject: subject,
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