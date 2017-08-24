import { Router } from 'express'
import authorize from 'passport/authorize'
import { getPagingRouter, getDetailRouter, getDeleteRouter } from 'routes/shared/utils'
import fetch from 'node-fetch'
import db from 'data/mysql'

const router  = new Router()
const tableName = 'celeb_events'
router.get('/index/:id', getDetailRouter(tableName))
router.delete('/delete/:id', getDeleteRouter(tableName))

router.get('/', (req, res)=>{  
  const {page=1, limit=10} = req.query  
  const maxLimit = Math.min(+limit, 10)
  const offset = (page-1) * limit  

  db.execute(`SELECT COUNT(*) AS count FROM ${tableName}`).spread(([{count}]) => {
    db.execute(`
      SELECT id, user_id, data->>"$.data" as data
      FROM ${tableName} LIMIT ${offset},${maxLimit}`
    ).spread(rows=>{
      rows.map(row=>{
        if(row.data)
          row.data = JSON.parse(row.data)
        return row
      })
      res.send({rows,count,offset})
    }).fail(err=>res.send(err))
  })
})

router.get('/list', (req, res)=>{  
  // const {page=1} = req.query  
  const itemsPerPage = 5
  // const limit = Math.round((req.query.limit || 10) / itemsPerPage)
  // const maxLimit = Math.min(+limit, Math.round(10 / itemsPerPage))
  // const offset = (page-1) * limit  

  // db.execute(`SELECT COUNT(*) AS count FROM ${tableName}`).spread(([{count}]) => {
    db.execute(`
      SELECT user_id, data->>"$.data" as data
      FROM ${tableName}`
    ).spread(rows=>{
      const data = rows.map(row=>{
        if(row.data)
          row.data = JSON.parse(row.data).map(rowItem=>({...rowItem, full_name: row.user_id}))
        return row.data
      }).reduce((a, b)=>a.concat(b)).sort((a, b)=> b.updated_time.localeCompare(a.updated_time))
      res.send({rows:data,count:rows.length * itemsPerPage,offset:0})
    // }).fail(err=>res.send(err))
  })
})

// admin update need authorize
router.get('/crawl/:user_id', async (req, res) => {
  authorize(req)
  const {user_id} = req.params
  const limit = 5  
  const access_token = req.user.fb_access_token
  const url = `https://graph.facebook.com/${user_id}/events?access_token=${access_token}&fields=interested_count,description,end_time,start_time,cover,updated_time,attending_count,admins{pic_large},place,maybe_count,is_canceled&limit=${limit}`
  const text =  await fetch(url).then(ret=>ret.text())  
  db.execute(`UPDATE ${tableName} SET data=:text WHERE user_id='${user_id}'`, {text})
  res.send(text)
})

router.get('/add/:user_id', (req, res)=>{
  authorize(req)
  const {user_id} = req.params
  db.execute(`
    INSERT INTO ${tableName} (user_id) 
    VALUES ('${user_id}')`
  ).then(rows=>res.send({success:true})).fail(err=>res.send(err))
})

export default router