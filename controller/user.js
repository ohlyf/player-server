const {User} = require('../model/index')
const jwt = require('jsonwebtoken')
const {createToken} = require('../utils/jwt')
const register = async (req, res) => {
  const userModel = new User(req.body)
  const dbBack = await userModel.save()
  let user = dbBack.toJSON()
  delete user.password
  res.status(201).json({
    user
  })
}

const login = async (req, res) => {
  let dbBack = await User.findOne(req.body)
  if (!dbBack) {
    res.status(402).json({error: '邮箱或者密码不正确'})
  }
  dbBack = dbBack.toJSON()
  dbBack.token = await createToken(dbBack)
  res.status(200).json({dbBack})
}

const list = async (req, res) => {
  console.log(req.user.userinfo)
  res.status(200).json(req.body)
}

module.exports = {register, login, list}