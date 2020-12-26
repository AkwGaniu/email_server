const express = require("express");
const fs = require('fs')
const dotenv = require('dotenv')
"use strict";
const nodemailer = require("nodemailer");
const handlebars = require("handlebars")
const path = require("path");
const app = express()

app.use(express.json())
dotenv.config()

const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/template/email_template.hbs"), "utf8")

const smtpTransport = nodemailer.createTransport({
  service: process.env.HOST,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

const template = handlebars.compile(emailTemplateSource)


app.use((req, resp, next) => {
    resp.header('Access-Control-Allow-Origin', '*')
    resp.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE')
    resp.header('Access-Control-Allow-headers', 'Content-type, Accept, x-access-token, x-key')
    if (req.method === 'OPTIONS') {
        resp.status(200).end()
    } else {
        next()
    }

})

app.post("/", async (req, resp, next) => {
  
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
    to: "lmd4sure@gmail.com",
    subject: "Virtual Meeting Details",
    html: htmlToSend
  }

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      next(error)
      console.log(error)
    } else {
      console.log(response)
      resp.json({
        error: 0,
        message: 'Success'
      })
    }
  })
});

//Custom Error Handler middleware
app.use((error, req, resp, next) => {
    resp.status(error.status || 500)
    resp.json({
        status: error.status,
        message: error.message,
        stack: error.stack
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("app listening on Port " + PORT);
});

sendMail =  async (data) => {

}