import authorize from 'passport/authorize'
import StatusCode from 'routes/status'
import db from 'data/mysql'

export const getPagingRouter = (tableName, fields='*', where, order) => (req, res)=> {
  const {page=1, limit=10} = req.query  
  const maxLimit = Math.min(+limit, 10)
  const offset = (page-1) * limit
  let orderStr = order ? ('ORDER BY ' + order) : ''
  let whereStr = ''
  if(where){
    whereStr = 'WHERE ' + (Object.keys(where).map(key=>key+'=:'+key).join(' AND ') || 'true')
  }

  db.execute(`SELECT COUNT(*) AS count FROM ${tableName} ${whereStr}`, where).spread(([{count}]) => {
    db.execute(`
      SELECT ${fields}
      FROM ${tableName} ${whereStr} ${orderStr} LIMIT ${offset},${maxLimit}`, where
    ).spread(rows=>res.send({rows,count,offset})).fail(err=>res.send(err))
  }).fail(err=>res.send(err))    
}

export const getDetailRouter = (tableName, fields='*') => (req, res) => {
  // tag is public
  const {id} = req.params
  db.execute(`
    SELECT ${fields}
    FROM ${tableName} WHERE id=${id} LIMIT 1`
  ).spread(([row])=>res.send(row)).fail(err=>res.send(err))    
}

export const getDeleteRouter = (tableName) => (req, res) => {
  authorize(req)
  const {id} = req.params
  db.execute(`
    DELETE
    FROM ${tableName} WHERE id=${id}`
  ).spread(rows=>res.send(rows)).fail(err=>res.send(err))   
}