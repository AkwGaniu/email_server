const express = require("express");
const dotenv = require('dotenv')
const upload_file= require('express-fileupload')
const fs = require('fs')

const app = express()

const router = require('./routes/router')

app.use(express.json())
app.use(upload_file())

dotenv.config()

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
    message: error.message
    // stack: error.stack
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("App listening on Port " + PORT);
})
