const fs = require('fs')
"use strict";
const nodemailer = require("nodemailer");
const handlebars = require("handlebars")
const path = require("path");
const emailTemplateSource = fs.readFileSync(path.join(__dirname, "../template/email_template.hbs"), "utf8")

const smtpTransport = nodemailer.createTransport({
  service: process.env.HOST,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

const template = handlebars.compile(emailTemplateSource)

module.exports.home = ("/", (req, resp, next) => {
  resp.status(200).json({
    error: 0,
    message: "Success"
  })
})

module.exports.sendMail = ("/send_mail", async (req, resp, next) => {
  try {
    const reciever = req.body.to
    const subject = req.body.subject
    if (reciever === '' || subject === '') {
      const error = new Error('Invalid parameters')
      error.status = 401
      throw error
    } else {
      const htmlToSend = template({
        meeting_title: 'data.title',
        meeting_id: 'data.meeting_id',
        host: 'host_name.names',
        meeting_date: 'data.date',
        start_time: 'data.from',
        end_time: 'data.to'
      })
      const mailOptions = {
        from: process.env.USER,
        to: reciever,
        subject: subject,
        html: htmlToSend
      }
      smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          const err = new Error(error)
          next(err)
        } else {
          resp.status(200).json({
            error: 0,
            message: 'mail sent'
          })
        }
      })
    }
  } catch (error) {
    const err = new Error(error)
    next(err)
  }

})