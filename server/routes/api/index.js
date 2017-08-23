import { Router } from 'express'

const router  = new Router()

router.use('/test', require('./test').default)
router.use('/notification', require('./notification').default)

export default router