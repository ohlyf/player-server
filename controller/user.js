const {User} = require('../model/index')

exports.register = async (req, res) => {
  const userModel = new User(req.body)
  const dbBack = await userModel.save()
  let user = dbBack.toJSON()
  delete user.password
  res.status(201).json({
    user
  })
}
