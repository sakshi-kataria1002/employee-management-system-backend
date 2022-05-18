const express = require('express')
const router = express.Router()
const EmployeeController = require('../controller/employeeController')
const AdminController = require('../controller/adminController')
const verify = require('../routes/authVerify')
const cors = require('cors')

// EMPLOYEE AUTHENTICATION
router.post('/signup', cors(), EmployeeController.signUp)
router.post('/signin', cors(), EmployeeController.signIn)
router.get('/getAllUsers', cors(),verify, EmployeeController.getAllUsers)
router.delete('/deleteEmployee/:id', cors(), EmployeeController.deleteEmployee)
router.put('/editEmployee/:id', cors(), EmployeeController.editEmployee)

// ADMIN AUTHENTICATION
router.post('/adminSignup', cors(), AdminController.signUp)
router.post('/adminSignin', cors(), AdminController.signIn)
router.post('/adminEmployeeSignup', cors(), AdminController.adminEmployeeSignup)

module.exports = router
