import { Router } from 'express'
import { db } from 'data/mysql'
const router  = new Router()

router.get('/mysql', async (req, res) => {
  const [rows] = await db.query('SELECT sentence->>"$[0].user" as username FROM facts')
  res.send(rows)  
})

export default router