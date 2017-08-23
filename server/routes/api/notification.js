import { Router } from 'express'
import models from 'models/mongodb'
import {sequelize, DataTypes} from 'models/config'
import authorize from 'passport/authorize'
import { getPagingRouter, getDetailRouter, getDeleteRouter } from 'routes/shared/utils/mongodb'
// import { uploadImage, uploadImages } from 'data/helper/image'
import { pushNotification } from 'services/push-notification'

const router  = new Router()

router.get('/index/:id', getDetailRouter(models.notifications, []))
router.get('/', getPagingRouter(models.notifications, [], null, {createdDate: -1}))
router.delete('/delete/:id', getDeleteRouter(models.notifications))

router.get('/getNotification', getPagingRouter(models.notifications, []))

// admin update need authorize
router.post('/update', async (req, res) => {
  authorize(req)
  const {item:data, id} = req.body  
  const notification = id 
    ? await models.notifications.findById(id).select('_id')  
    : models.notifications({createdDate:new Date()})
  // update image  
  Object.assign(notification, data)
  notification.save()
  res.send(notification)
})

// router.get('/notiMessage', async (req, res) => {
//   // authorize(req)
//   const {id, message} = req.body
//   const users = await models.users.find({}).select('deviceList') 
//   const deviceList = users.map(c=>c.deviceList).reduce((a, b) => [...a, ...b])
//   const result = [
//     deviceList, 
//     "RUDiCAF", 
//     message, 
//     {notice: "new-message", date:new Date()}
//   ]

//   res.send(result)  
// })

router.post('/notiMessage', async (req, res) => {
  authorize(req)
  const {id, message} = req.body
  const users = await models.users.find({}).select('deviceList') 
  const deviceList = users.map(c=>c.deviceList).reduce((a, b) => [...a, ...b])
  const result = await pushNotification(
    deviceList, 
    "RUDiCAF", 
    message, 
    {notice: "new-message", date:new Date()}
  )

  res.send(result)  
})

export default router