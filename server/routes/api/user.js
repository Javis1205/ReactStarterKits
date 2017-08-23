import { Router } from 'express'
import models from 'models/mongodb'
import path from 'path'

// import {sequelize, DataTypes} from 'models/config'
import authorize from 'passport/authorize'
import { getPagingRouter, getDetailRouter, getDeleteRouter } from 'routes/shared/utils/mongodb'
import { uploadImage, uploadImages } from 'data/helper/image'

import { cryptPassword, comparePassword } from 'passport/password-crypto'
import jwt from 'jsonwebtoken'
import { jwtSecret }   from 'config/constants'
import StatusCode from 'routes/status'
import { pushNotification } from 'services/push-notification'
import { updateHistoryLog } from 'services/users'
import { BASE_URL } from 'config/constants'

const fixImageUrl = (user, req) => {  
  user.avatarPath = `${BASE_URL}/uploads/resources/${user.avatarPath}`
  user.imagePathList = user.imagePathList.map(c=>`${BASE_URL}/uploads/resources/${c}`)
  // return {
  //   ...user,
  //   avatarPath: `${BASE_URL}/${user.avatarPath}`
  // }
  return user
}

const userFields = 'username name avatarPath dob gender address highestEducationLevel latestCollege company position maritalStatus hobby favouriteQuotations otherInfo imagePathList distance'

const getDistance = (lat1, lng1, lat2, lng2) => {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(lat2 - lat1);
  var dLong = rad(lng2 - lng1);  
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d; // returns the distance in meter
};

// Converts numeric degrees to radians
const rad = value => 
  value * Math.PI / 180

const router  = new Router()

router.get('/index/:id', getDetailRouter(models.users, []))
router.get('/', getPagingRouter(models.users, [],
  req => {
    const {name, age, highestEducationLevel, address, gender, active} = req.query    
    const where = {}

    // build custom query here, no need to use framework
    if(age){
      const year = new Date().getFullYear() - age
      const start = new Date("01-01-" + year + " 00:00:00");                        
      const end = new Date("01-01-" + (year + 1) + " 00:00:00");
      where.dob = {
        '$gte': start,
        '$lt' : end,
      }
    }
    if(name) 
      where.name = { "$regex": name, "$options": "i" }
    if(address) 
      where.address = { "$regex": address, "$options": "i" }
    if(highestEducationLevel) 
      where.highestEducationLevel = { "$regex": highestEducationLevel, "$options": "i" }
    if(gender && gender !== 'A') 
      where.gender = gender
    if(active)
      where.active = active

    return where
  },  
  {_id:-1}
))
router.delete('/delete/:id', getDeleteRouter(models.users))

router.put('/block/:id', async (req, res) => {
  authorize(req)
  // only admin user can block
  const {id} = req.params
  const user = await models.users.findById(id).select('active')
  if(!user)
    return res.status(204).end()

  user.active = !user.active
  user.save()
  res.send({id})
  
  
})

// admin update need authorize
router.post('/update', async (req, res) => {
  authorize(req)
  // currently we not process items, let it for edit phrase
  const {item:{avatarPath, imagePathList, ...data}, id} = req.body
  // check authorize first, for update, also check author_id for post
  // check req.user.id to update
  // currently we not process items, let it for edit phrase
  const user = id 
    ? await models.users.findById(id).select('imagePathList avatarPath')  
    : models.users()
  // update image
  uploadImage(avatarPath, user.avatarPath, `resources`, imagePath => user.avatarPath=path.basename(imagePath))  
  uploadImages(imagePathList, user.imagePathList, `resources`, 
      imagePaths => user.imagePathList=imagePaths.map(field=>path.basename(field)) )
  Object.assign(user, data)
  user.save()
  res.send(user)
})


/**
  *
  * api functions
  *
  */  

const respondLogin = ({user, token}, res) =>   {
  const data = fixImageUrl(user)
  res.send(user ? {code: StatusCode.OK, user:data, token} : {code: StatusCode.INVALID_USER, message: "Invalid User"})
}

const respondUser = (user, res) =>   {
  const data = fixImageUrl(user)
  res.send(data ? {code: StatusCode.OK, user:data} : {code: StatusCode.INVALID_USER, message: "Invalid User"})
}

const respondUsers = (users, res, message="No user around you") =>{
  const data = users.map(user=>fixImageUrl(user)) 
  res.send(data ? {code: StatusCode.OK, users:data} : {code: StatusCode.NO_INFO, message})  
}
const respondMessage = (code, message, res) => 
  res.send({code, message})  

const generateAccessToken = (req, res, next) => {  
  // we just get back user with id and email is good enough  
  // we use role to differentiate with other users  
  jwt.sign({
    _id: req.user._id,
    // use login_token or username as identify detail
    username: req.user.username,
  }, jwtSecret, {
    expiresIn: 60*60*24*7,   // just 1 week, user can not refresh token
  },(err, accessToken) => {        
    req.token = {
      accessToken,
    }
    next()    
  })  
}

router.post('/login', async (req, res, next) => {  
  const {username, password} = req.body
  const user = await models.users.findOne({username, password, active:1})
    .select('-password -deviceList -logList')
  
  if(!user)
    return res.send({code: StatusCode.INVALID_USER, message: "Invalid User"})

  // filter result before returning to client
  req.user = user

  // next middle 
  next()
}, generateAccessToken, respondLogin)


// we just logout the passport, then redirect to home page or login page
// we do not use session, if you use it you have to redirect in req.session.destroy(function (err) {})
router.post('/logout', (req, res) => {
  if(!req.user){
    return res.status(204).end()
  }
  
  // logout passport to end access token immediately
  req.logout()
})

router.post('/addDeviceToken', async (req, res)=>{
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)
    
  const {deviceToken:deviceId, type:deviceType} = req.body
  const user = await models.users.findById(req.user._id).select('_id')    
  user.deviceList = [{deviceId, deviceType}]
  user.save()
  respondMessage(StatusCode.OK, "Add Device Token successfully", res)
  
})

router.get('/search', async (req, res)=>{  
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)

  const {gender, maxAge, minAge, lat, lng, city} = req.query

  const year = new Date().getFullYear()
  const start = new Date("01-01-" + (year  - maxAge) + " 00:00:00");                        
  const end = new Date("01-01-" + (year - minAge) + " 00:00:00");
  const options = {
    dob: {
      '$gte': start,
      '$lt' : end,
    }    
  }
  gender && (options.gender = gender.toUpperCase())
  if(city) 
      options.address = { "$regex": city, "$options": "i" }
  let users = await models.users.find(options).select('-password')
  if(lat && lng) {
    users = users.map(user=>{      
      const ret = user.toObject()
      ret.distance = getDistance(user.lat, user.lon, lat, lng)
      return ret
    })
  }

  respondUsers(users, res)  
})

router.get('/getCityList', async(req,res)=>{
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)
  const users = await models.users.aggregate([
  {
    "$group":{
      _id: "$address",
      "total": {$sum: 1}
    }
  },
  ])
  
  res.send(users)
})

router.get('/searchAll', async (req, res)=>{  
  const {username} = req.query  
  const users = await models.users.find({username:{ "$regex": username, "$options": "i" }}).select('-password')
  respondUsers(users, res)  
})

router.get('/searchByUsername', async (req, res)=>{  
  const {username} = req.query
  const user = await models.users.findOne({username}).select('-password')
  respondUser(user, res)      
})

router.get('/searchByUsername', async (req, res)=>{  
  const {username} = req.query
  const user = await models.users.findOne({username}).select('-password')
  respondUser(user, res)      
})

router.post('/updateLocation', async (req, res)=>{
  if(!req.user)
    return respondMessage(StatusCode.UPDATE_LOCATION_FAILED, "Update Location failed", res)
  const {lat,lon} = req.body
  const user = await models.users.findById(req.user._id).select('_id')
  Object.assign(user,{lat,lon})
  user.save()
  respondMessage(StatusCode.OK, "Update Location Successfully", res)
})

router.post('/favorite', async (req, res)=>{
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)

  const {username, isLike} = req.body
  const likeList = []
  const user = await models.users.findById(req.user._id).select('username name favoriteList logList')
  const index = user.favoriteList.indexOf(username)
  // new likes
  if(isLike){
    if(index === -1){
      user.favoriteList.addToSet(username)
      likeList.push(username)
      user.save()
    }
  } else {
    if(index !== -1){
      user.favoriteList.splice(index, 1)
      user.save()
    }
  }
 
  const message = `${user.name} đã like bạn`
  const data = {notice:'like', message}
  const likeUserList = await models.users.find({username:{$in:likeList}}).select('username name logList deviceList')
  likeUserList.forEach(likeUser=>{    
    pushNotification(likeUser.deviceList, message, message, data);    
    updateHistoryLog(user, likeUser.username, 'Bạn đã thích một người', `Bạn đã thích ${likeUser.name}`)
    updateHistoryLog(likeUser, user.username, 'Có người đã thích bạn', `${user.name} đã thích bạn`)
  })
  // response
  respondMessage(StatusCode.OK, "Update Favorite List Successfully", res)
})

router.post('/updateFavoriteList', async (req, res)=>{
  if(!req.user)
    return respondMessage(StatusCode.UPDATE_FAVORITE_LIST_FAILED, "Update Favorite List failed", res)
  const {favoriteList} = req.body
  const user = await models.users.findById(req.user._id).select('username name favoriteList logList')
  // new likes
  const likeList = favoriteList.filter(username => user.favoriteList.indexOf(username) === -1)
  // un like
  // const unlikeList = user.favoriteList.filter(username => favoriteList.indexOf(username) === -1)  
  Object.assign(user,{favoriteList})
  user.save()
  const message = `${user.name} đã like bạn`
  const data = {notice:'like', message}
  const likeUserList = await models.users.find({username:{$in:likeList}}).select('username name logList deviceList')
  likeUserList.forEach(likeUser=>{    
    pushNotification(likeUser.deviceList, message, message, data);    
    updateHistoryLog(user, likeUser.username, 'Bạn đã thích một người', `Bạn đã thích ${likeUser.name}`)
    updateHistoryLog(likeUser, user.username, 'Có người đã thích bạn', `${user.name} đã thích bạn`)
  })
  // response
  respondMessage(StatusCode.OK, "Update Favorite List Successfully", res)
})

router.post('updateHistoryLog', async (req, res)=>{
  if(!req.user)
    return respondMessage(StatusCode.UPDATE_FAVORITE_LIST_FAILED, "Update History List failed", res)
  const {relatedUser,content,title} = req.body
  const user = await models.users.findById(req.user._id).select('username name favoriteList logList')
  updateHistoryLog(user, relatedUser, title, content)  
  respondMessage(StatusCode.OK, "Update History List Successfully", res)
})

router.get('/countFanzone', async (req, res) => {  
  const countFanzone = await models.users.count({favoriteList:req.query.username})
  res.send({code: StatusCode.OK, countFanzone})
})

router.get('/getFanzone', async (req, res) => {
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)
  const user = await models.users.findById(req.user._id).select('username')
  const users = await models.users.find({favoriteList:user.username}).select(userFields)  
  respondUsers(users, res, "No user in your fanzone")
})

router.get('/getFavoriteList', async (req, res) => {
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)  
  const user = await models.users.findById(req.user._id).select('favoriteList')
  const userList = user.favoriteList
  const users = await models.users.find({username:{$in:userList}}).select(userFields)
  respondUsers(users, res, "No user in your favorite list")  
})

router.get('/getHistoryLog', async (req, res) => {
  try{
    if(!req.user)
      return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)
    const user = await models.users.findById(req.user._id).select('logList')
    res.send({code: StatusCode.OK, logList:user.logList})
  } catch(err) {
    res.send({code:StatusCode.SERVER_ERROR, message:err.message})
  }
})

router.post('/updateSeenList', async (req, res) => {
  if(!req.user)
    return respondMessage(StatusCode.UPDATE_FAVORITE_LIST_FAILED, "Update Seen Notification List failed", res)
  const {seenList} = req.body
  const user = await models.users.findById(req.user._id).select('seenNotiList')
  // merge seen notification list
  seenList.forEach(noti=>user.seenNotiList.addToSet(noti))  
  user.save()
  respondMessage(StatusCode.OK, "Update Seen Notification List Successfully", res)
})

router.post('/seenNotification', async (req, res) => {
  if(!req.user)
    return respondMessage(StatusCode.UPDATE_FAVORITE_LIST_FAILED, "Update Seen Notification List failed", res)
  const {notiid} = req.body
  const user = await models.users.findById(req.user._id).select('seenNotiList')
  // merge seen notification list
  user.seenNotiList.addToSet(notiid)  
  user.save()
  respondMessage(StatusCode.OK, "Update Seen Notification List Successfully", res)
})

router.post('/seeHistoryLog', async (req, res) => {
  if(!req.user)
    return respondMessage(StatusCode.UPDATE_HISTORY_LOG_FAILED, "Update History List failed", res)
  const {id} = req.body  
  models.users.findOneAndUpdate({_id:req.user._id, 'logList.id': id}, {'$set': {
      'logList.$.isRead': true
  }},{upsert: true, 'new': true})  
  respondMessage(StatusCode.OK, "Update History List Successfully", res)
})

router.post('/seenHistoryLog', async (req, res) => {
  if(!req.user)
    return respondMessage(StatusCode.UPDATE_HISTORY_LOG_FAILED, "Update History List failed", res)
  const {historyId} = req.body  
  const user = await models.users.findOneAndUpdate({_id:req.user._id, 'logList.id': historyId}, {$set: {
      'logList.$.isRead': true,
  }},{upsert: true, 'new': true})  
  respondMessage(StatusCode.OK, "Update History List Successfully", res)
  // res.send({code:StatusCode.OK, user})  
})

router.post('/testHistory', async(req,res)=>{
  const {historyId} = req.body  
  const test = await models.users.find({_id:req.user._id, 'logList.id': historyId}).select('logList.$')  
  test.isRead = true
  test.save()
  res.send(test)
})

router.get('/getSeenNotiList', async(req, res) =>{
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)  
  const user = await models.users.findById(req.user._id).select('seenNotiList')
  res.send({status:StatusCode.OK, seenNotiList:user.seenNotiList})
})


router.post('/notiNewUser', async (req, res) => {
  authorize(req)
  const {id, message} = req.body
  const users = await models.users.find({_id:{$ne: id}}).select('deviceList') 
  const deviceList = users.map(c=>c.deviceList).reduce((a, b) => [...a, ...b])
  const result = await pushNotification(
    deviceList, 
    "RUDiCAF", 
    message, 
    {notice: "new-user", date:new Date()}
  )

  res.send(result)  
})


export default router