import { Router } from 'express'
import { getPagingRouter, getDetailRouter, getDeleteRouter } from 'routes/shared/utils'
const router  = new Router()

router.get('/index/:id', getDetailRouter('notifications', []))
router.get('/', getPagingRouter('notifications', [], null, {createdDate: -1}))
router.delete('/delete/:id', getDeleteRouter('notifications'))

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

export default router