const express = require('express')
const userController = require('../controller/user')
const {register} = require('../middleware/validator')

const router = express.Router()
router.post('/register', register, userController.register)

module.exports = router