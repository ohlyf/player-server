const mongoose = require('mongoose')
const {mongo} = require('../config/config.default')
mongoose.set('strictQuery', false)

async function main() {
  await mongoose.connect(mongo.url)
}

main().then(res => {
  console.log('mongo连接成功')
}).catch(err => {
  console.log(err, 'mongo连接失败')
})

module.exports = {
  User: mongoose.model('User', require('./userModel'))
}