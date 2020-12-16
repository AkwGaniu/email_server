const express = require("express");
const fs = require('fs')
"use strict";
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport")
const handlebars = require("handlebars")
const path = require("path")
const app = express()

app.use(express.json())

const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/template/email_template.hbs"), "utf8")

const mailgunAuth = {
  auth: {
    api_key: "5298e83281cf2f48423a0068bafc137a-ea44b6dc-61771cee",
    domain: "sandboxc885cd9fbdb1408f8119ff8dc5589a0c.mailgun.org"
  }
}

const smtpTransport = nodemailer.createTransport(mg(mailgunAuth))

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

app.post("/", (req, resp, next) => {
    const replyData = null
    const payload = {
        meeting_title: 'data.title',
        meeting_id: 'data.meeting_id',
        host: 'host_name.names',
        meeting_date: 'data.date',
        start_time: 'data.from',
        end_time: 'data.to'
      }
    const reply = sendMail(payload)
    if (reply) {
        replyData = {
            error: 0,
            message: 'Success'
        }
    } else {
        replyData = {
            error: 0,
            message: "Success"
        }
    }
    return resp.json(replyData);
});

// app.post("/send", (req, res) => {
//   var transporter = nodemailer.createTransport({
//     host: "mail.privateemail.com",
//     secure: true,
//     port: 465,
//     auth: {
//       user: "info@movento.ltd",
//       pass: "Movento2020",
//     },
//   });

//   var mailOptions = {
//     from: "info@movento.ltd",
//     to: "info@movento.ltd",
//     subject: `${req.body.subject}`,
//     html: `
//     <p><strong>Fullname: ${req.body.fullname}</strong></p>
//     <p> <strong>Email Address: ${req.body.email}</strong></p>
//     <p> <strong> Message: ${req.body.message}</strong></p>
//     `,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(200).json({
//         error: 1,
//         message: "There was an issue sending mail",
//       });
//     } else {
//       return res.status(200).json({
//         error: 0,
//         message: "Email has been sent successfully!!!",
//       });
//     }
//   });
// });

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

sendMail =  (data) => {

    const htmlToSend = template({
        meeting_title: data.title,
        meeting_id: data.meeting_id,
        meeting_date: data.date,
        start_time: data.from,
        end_time: data.to
      })
      
      const mailOptions = {
        from: "ganiu.akowanu@gmail.com",
        to: "lmd4sure@gmail.com",
        subject: "Virtual Meeting Details",
        html: htmlToSend
      }
  
      smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
          console.log(error)
          next(error)
        } else {
            return true
        }
      })
}