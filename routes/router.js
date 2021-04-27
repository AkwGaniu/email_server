const router = require('express').Router()
const controller = require('../controllers/main')
const adminController = require('../controllers/adminController')

router.get('/', controller.home)
router.post('/send_mail', controller.sendMail)
router.post('/add_student', adminController.addStudent)
router.post('/add_department', adminController.addDepartment)
router.post('/add_faculty', adminController.addFaculty)
router.post('/fetch_student_details', adminController.fetchStudent)

module.exports = router