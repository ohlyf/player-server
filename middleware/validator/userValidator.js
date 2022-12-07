const {body} = require('express-validator')
const validate = require('./errorBack')

const register = validate([
  body('username').notEmpty().withMessage('用户名不能为空').bail().isLength({min: 3}).withMessage('用户名长度不能小于3'),
  body('email').notEmpty().withMessage('邮箱不能为空')
])

const login = validate([
  body('email').notEmpty().withMessage('邮箱不能为空').bail().isEmail().withMessage('邮箱格式错误').bail(),
  body('password').notEmpty().withMessage('密码不能为空')
])

module.exports = {
  register, login
}