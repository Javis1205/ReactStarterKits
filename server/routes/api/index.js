import { Router } from 'express'

const router  = new Router()

router.use('/test', require('./test').default)
router.use('/events', require('./events').default)

export default router