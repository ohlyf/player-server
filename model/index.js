const mongoose=require('mongoose')
mongoose.set('strictQuery',false)
async function main(){
  await mongoose.connect('mongodb://admin:abc123456@47.99.147.11:27017/player?authSource=admin')
}

main().then(res=>{
  console.log('mongo连接成功')
}).catch(err=>{
  console.log(err,'mongo连接失败')
})

module.exports={
  User:mongoose.model('User',require('./userModel'))
}