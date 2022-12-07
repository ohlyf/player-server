const express=require('express')

const router=express.Router()
const videoController=require('../controller/video')
router.get('/list',videoController.list).get('/videos',(req,res)=>{
  console.log(req.method)
  res.send('/videos')
})

module.exports=router