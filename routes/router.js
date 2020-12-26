const router = require('express').Router()
const controller = require('../controlers/main')

router.get('/', controller.home)
router.post('/send_mail', controller.sendMail)

module.exports = router