import { Router } from 'express'

import acl from 'passport/acl'
import models from 'models/mongodb'

import fse from 'fs-extra'
import fs from 'fs'
import path from 'path'
import request from 'request'
import { filePath } from 'config/constants'
import fetch from 'node-fetch'
import { pushNotification } from 'services/push-notification'

const router  = new Router()


// const download = (uri, filepath, callback) => {
//   request.head(uri, (err, res, body)=>{
//     request(uri).pipe(fs.createWriteStream(filepath)).on('close', callback);    
//   })
// }

router.get('/viewTester2', async(req, res) => {
  const user = await models.users.findOne({username:'tester_2'}).select('deviceList') 
  res.send(user.deviceList)
})

router.get('/resetTester2', async(req,res) => {
  const user = await models.users.findOneAndUpdate({username:'tester_2'}, {$set:{deviceList:[]}}).select('deviceList') 
  res.send(user.deviceList)
})

router.get('/sendTester2', async(req,res) => {
  const {message} = req.query
  const user = await models.users.findOne({username:'tester_2'}).select('deviceList') 
  const result = await pushNotification(
    user.deviceList, 
    "RUDiCAF", 
    message, 
    {notice: "new-message", date:new Date()}
  )

  res.send(result)  
})

router.get('/index', async (req, res) => {  
  // const users = await models.users.find({_id:{$ne:'587101cf45ce9448cef2fbc9'}}).select('deviceList') 
  // const deviceList = users.map(c=>c.deviceList).reduce((a, b) => [...a, ...b])
  // res.send(deviceList)

  // after await (in callback), rows will be put in callback and can be access normal
  // other chain method will not be treated as normal
  // const user = await models.users.findById('587101cf45ce9448cef2fbc9').select('deviceList')
  // const result = await pushNotification(
  //   user.deviceList, 
  //   "RUDiCAF", 
  //   `Bùi Thúy An mới gia nhập RUDICAF Dating`, 
  //   {notice: "new-booking-date", date:new Date()}
  // )

  // res.send(result)  

  // pushNotification([
  // {
  //   deviceId:'e0Rcl6RHB_A:APA91bF-tZzGOX_GA9UfwnibKtIi0pN0uCoXpBhhP3wPYMJ0CBkCnX2VV-FOxh1oF_5bBmSSNpiQzQiGoLYD3qevvLqG9qRxvaqVU2ivhfYzb_uE3jbTNZNaJ7ffeMXXedU2HtfESENR', 
  //   deviceType:'Android'
  // }
  // ], 
  //   "RUDiCAF", 
  //   `Ngoc  muốn hẹn hò với bạn`, data, result=>{
  //   res.send(result)  
  // })

  

  
})

router.get('/update/user/image', async ({params:{id=0}}, res) => {  
  // try {
  //   // put multi-async in this block instead of using callback hell    
  //   const users = await models.users
  //     .find({}).select('avatarPath imagePathList')

  //   users.forEach(user => {
  //     // console.log or res.send will return json cast, but destructive must use inner field like _doc
  //     const {_id, avatarPath, imagePathList} = user._doc
  //     // if(avatarPath){
  //     //   const basename = path.basename(avatarPath)
  //     //   let uri = `http://vistip.vn:8081/DatingCMS/file/${basename}`      
  //     //   let folder = `user/avatar/${_id}`
  //     //   let imagepath = path.join(filePath, folder)
  //     //   let filepath = path.join(imagepath, basename)
  //     //   let filename = `/uploads/${folder}/${basename}`
  //     //   fse.ensureDir(imagepath,  (err) => {
  //     //     download(uri, filepath, function(){
  //     //       user.avatarPath = filename
  //     //       user.save()
  //     //     })
  //     //   })
  //     // }

  //     imagePathList && imagePathList.forEach((imagePath, index) => {
  //       if(imagePath){
  //         const basename = path.basename(imagePath)
  //         let uri = `http://vistip.vn:8081/DatingCMS/file/${basename}`
  //         let folder = `user/image/${_id}`
  //         let imagepath = path.join(filePath, folder)
  //         let filepath = path.join(imagepath, basename)
  //         let filename = `/uploads/${folder}/${basename}`
  //         // console.log(uri, filepath)
  //         // fse.ensureDir(imagepath,  (err) => {
  //         //   download(uri, filepath, function(){
  //         //     user.imagePathList[index] = filename
  //         //     user.save()
  //         //   })
  //         // })
  //         user.imagePathList.set(index, filename)
  //       }
  //     })
  //     // if not use array set, we can hook into function to know which modified, so call this
  //     // user.markModified('imagePathList')
  //     user.save()

  //   })
  //   res.send(users)
  // } catch(err){
  //   console.log(err)
  //   res.end()      
  // }

})


router.get('/location', (req,res)=>{
  const q = encodeURIComponent(req.query.q)
  fetch('https://www.google.com/search?tbm=map&hl=vi&q=' + q).
  then(ret=>ret.text())
  .then(ret=>{
    const match = ret.match(/www\.google\.com\/maps\/preview\/place\/[^\/]+\/@([\d\.]+),([\d\.]+),/)
    res.json({
      lat: match[1],
      lng: match[2],
      search: req.query.q,
    })
  })
})


export default router