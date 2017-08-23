import { Router } from 'express'

const router  = new Router()

router.use('/test', require('./test').default)
router.use('/user', require('./user').default)
router.use('/dating', require('./dating').default)
router.use('/notification', require('./notification').default)

export default router