const express = require("express");
const dotenv = require('dotenv')
// const upload_file = require('express-fileupload')
const mongoose = require('mongoose')
const app = express()
dotenv.config()

const router = require('./routes/router')

app.use(express.json())
// app.use(upload_file())


//DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, (err) => {
  if(err) return console.log(`Error: ${err}`)
  console.log("We are connected")
})

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

app.use('/', router)

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
  console.log("App listening on Port " + PORT);
})
