import { Router } from 'express'

import acl from 'passport/acl'
import models from 'models/mongodb'
import StatusCode from 'routes/status'

import { getPagingRouter, getDetailRouter, getDeleteRouter } from 'routes/shared/utils/mongodb'

import { pushNotification } from 'services/push-notification'
import { updateHistoryLog } from 'services/users'

const router  = new Router()

const respondMessage = (code, message, res) => 
  res.send({code, message})  

const validateError = (datetime, content, address) => {
  if(!content)
    return 'content'
  if(!address)
    return 'address'
  if(!Date.parse(datetime))
    return 'datetime'

  return false
}

const findDate = async (username)=>{
  const dateList = await models.datings.find({
    $or: [
      {from: username},
      {to: username},
    ],
    status: {$ne: 'denied'},
    datetime: {$gt: new Date()}
  }).sort({createdDate:-1})
  return dateList
}

const isConflictingTime = async (username, datetime, dateId) => {
  const dateList = await findDate(username)  
  for(const datetmp of dateList){
    if (dateId && dateId == datetmp._id) {
        continue
    }
    
    // already has username as from or to
    if(datetmp.status == 'accepted'){            
      const diffMinutes = Math.abs(datetmp.datetime.getTime()-datetime.getTime()) / (60 * 1000)      
      if(diffMinutes < 60){                
        return true
      }
    }
  }
  return false
}

const createDate = (datetime, content, address, from, to) => {
    // let mongoose handles _id automatically
    const date = models.datings({
      datetime,
      content,
      address,
      from,
      to,
      createdDate: new Date(),
      status: "not process"
    })    
    date.save()
    return date
}

router.post('/book', async (req, res) => {
  if(!req.user)
    return res.send({code: StatusCode.NOT_ABLE_TO_BOOK_DATE, message:"Book date failed"})

  try{

    const {to, datetime, address, content} = req.body
    const sender = await models.users.findById(req.user._id).select('-password -deviceList')
    const receiver = await models.users.findOne({username:to}).select('-password')
    if (!receiver) 
      return respondMessage({code:StatusCode.INVALID_PARAMETER, message:"Receiver doesn't exist", parameter:"to"})

    const usernames = [req.user.username, to]
    const isNotAbleToBookDate = await models.datings.count({
      from:usernames,
      to: usernames,
      status: 'denied'
    }).limit(3) === 3

    if(isNotAbleToBookDate) 
      return res.send({code: StatusCode.NOT_ABLE_TO_BOOK_DATE, message:`${req.user.username} is not able to book a date with ${to}`})

    const invalidParameter = validateError(datetime, content, address)
    if(invalidParameter)
      return res.send({code: StatusCode.INVALID_PARAMETER, parameter: invalidParameter, message:`Invalid ${invalidParameter}`})
    const datetimeTmp = new Date(datetime)

    if(await isConflictingTime(req.user.username, datetimeTmp, null)){
      return res.send({code: StatusCode.CONFLICTING_TIME, message:"Another date has the same time"})
    }

    const date = await createDate(datetimeTmp, content, address, req.user.username, to)

    const message = `${sender.name} muốn hẹn hò với bạn`

    const data = {notice: "new-booking-date", dateId: date._id}
    pushNotification(receiver.deviceList, message, message, data)

    updateHistoryLog(sender, receiver.username, "Bạn đã đặt lịch hẹn thành công", `Bạn đã đặt lịch hẹn thành công với ${receiver.name}`)
    res.send({code:StatusCode.OK, date})

  } catch(err){
    return respondMessage(StatusCode.SERVER_ERROR, err.message, res)
  }

})

router.get('/getWaitingBook', async(req,res)=>{
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)

  const dateList = await models.datings.find({    
    to: req.user.username,
    status:{
      $not: {           
        $in: ['denied','accepted']
      }      
    },    
    datetime: {$gt: new Date()}
  }).sort({datetime: -1})

  res.send({code: StatusCode.OK, dateList})
})

router.get('/getIncomingBook', async(req,res)=>{
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)
  const username = req.user.username
  const dateList = await models.datings.find({    
    // to: req.user.username,
    $or: [
      {from: username},
      {to: username},
    ],
    status: 'accepted',
    datetime: {$gt: new Date()}
  }).sort({datetime: -1})

  res.send({code: StatusCode.OK, dateList})
})

router.get('/', getPagingRouter(models.datings, []))

router.post('/getDateById', async(req,res)=>{
  const {dateId:id} = req.body

  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)
  
  const date = await models.datings.findById(id)

  res.send({code: StatusCode.OK, date})
})

router.post('/acceptDate', async (req, res) => {
  const {acceptingMessage, dateId:id} = req.body
  if(!req.user)
    return res.end()
  const date = await models.datings.findById(id)
  if(await isConflictingTime(req.user.username, date.datetime, date._id)){
    return res.send({code: StatusCode.CONFLICTING_TIME, message:"Another date has the same time"})
  }

  const receiver = await models.users.findById(req.user._id)
  const sender = await models.users.findOne({username: date.from})
  Object.assign(date, {
    status: 'accepted',
    acceptingMessage,
    lastModified: new Date(),
  })
  date.save()

  const message = `${receiver.name} đã đồng ý hẹn hò với bạn`

  const data = {notice: "accepted-booking-date", dateId: id}

  pushNotification(sender.deviceList, message, message, data)
  updateHistoryLog(receiver,  sender.username, "Bạn đã chấp nhận lịch hẹn", `Bạn đã đặt lịch hẹn thành công với ${sender.name}`)
  res.send({code:StatusCode.OK, date})

})

router.post('/addDevice', async (req, res) => {
  if(!req.user)
    return res.end()
  const user = await models.users.findById(req.user._id).select('deviceList')
  const {deviceId, deviceType} = req.body
  const ind = user.deviceList.findIndex(device=>device.deviceType == deviceType)  
  if(ind)
    user.deviceList.set(ind, {deviceId, deviceType})
  else
    user.deviceList.push({deviceId, deviceType})  
  user.save()
  // should not clean, should uniq
  res.send({code:StatusCode.OK})
})

router.post('/denyBook', async (req, res) => {
  const {denyingMessage, dateId:id} = req.body
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)
  const date = await models.datings.findById(id)  

  const receiver = await models.users.findById(req.user._id)
  const sender = await models.users.findOne({username: date.from})
  Object.assign(date, {
    status: 'denied',
    denyingMessage,
    lastModified: new Date(),
  })
  date.save()

  const message = `${receiver.name} đã từ chối hẹn hò với bạn`

  const data = {notice: "denied-booking-date", dateId: id}

  pushNotification(sender.deviceList, message, message, data)

  updateHistoryLog(sender, receiver.username, "Có người đã huỷ lịch hẹn với bạn", `${receiver.name} đã huỷ lịch hẹn với bạn`)
  updateHistoryLog(receiver, sender.username, "Bạn đã huỷ lịch hẹn", `Bạn đã huỷ lịch hẹn với ${sender.name}`)
  res.send({code:StatusCode.OK, date})
})

router.post('/decideBookLater', async (req, res) => {
  const {dateId:id} = req.body
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)
  const date = await models.datings.findById(id)  

  const sender = await models.users.findById(req.user._id)
  const receiver = await models.users.findOne({username: date.from})
  Object.assign(date, {
    status: 'decide later',    
    lastModified: new Date(),
  })
  date.save()
  updateHistoryLog(sender, receiver.username, "Bạn đã bỏ qua lịch hẹn", `Bạn đã bỏ qua lịch hẹn với ${receiver.name}`)  
  res.send({code:StatusCode.OK, date})
})

router.post('/changeDate', async (req, res) => {
  if(!req.user)
    return respondMessage(StatusCode.SERVER_ERROR, "Unauthorized", res)
  
  const {dateId:id, datetime, content, address} = req.body  
  const date = await models.datings.findById(id) 
  if (!date || (req.user.username != date.to)) {
    return res.send({code:StatusCode.INVALID_PARAMETER, parameter: 'id', message: 'Invalid id'})
  }

  const invalidParameter = validateError(datetime, content, address)
  if(invalidParameter)
    return res.send({code: StatusCode.INVALID_PARAMETER, parameter: invalidParameter, message:`Invalid ${invalidParameter}`})

  const sender = await models.users.findOne({username:date.to})
  const receiver = await models.users.findOne({username:date.from})
  const datetimeTmp = new Date(datetime)
  if(await isConflictingTime(req.user.username, datetimeTmp, date._id)){
    return res.send({code: StatusCode.CONFLICTING_TIME, message:"Another date has the same time"})
  }
  
  Object.assign(date, {
    content,
    address,
    datetime,
    from: date.to,
    to: date.from,
    status:'not process',
    lastModified: new Date(),
  })

  date.save()

  const message = `${sender.name} muốn thay đổi lịch hẹn hò với bạn`

  const data = {notice: "changed-booking-date", dateId: id}
  pushNotification(receiver.deviceList, message, message, data)
   
  res.send({code:StatusCode.OK, date})

})

export default router