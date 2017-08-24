import { Router } from 'express'
import db from 'data/mysql'
const router  = new Router()

router.get('/mysql', async (req, res) => {
  // const [rows] = await db.query('SELECT sentence->>"$[0].user" as username FROM facts')
  const {email} = req.query
  const [rows] = await db.execute(`
    SELECT id, name, email, encrypted_password, fb_access_token 
    FROM admin_users WHERE email = :email LIMIT 1`, {email})
  
  res.send(rows)  
})

export default router