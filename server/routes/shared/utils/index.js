import authorize from 'passport/authorize'
import StatusCode from 'routes/status'

export const getPagingRouter = (model, attributes=[], include=[], where, order) => (req, res)=> {
  const {page=1, limit=10} = req.query  
  const maxLimit = Math.min(+limit, 10)

  const offset = (page-1) * limit
  const options = {
    limit: maxLimit,
    offset,
    attributes,
    include
  }
  
  if(where){
    options.where = typeof where === 'function' ? where(req) : where
  }
  if(order){
    options.order = typeof order === 'function' ? order(req) : order
  }


  model.findAndCount(options).then(result => {
    res.send({...result, offset})
  }).catch(ex=>res.send({StatusCode.SERVER_ERROR, message: ex.message}))
}

export const getDetailRouter = (model, attributes, include=[]) => (req, res) => {
  // tag is public
  const {id} = req.params
  const options = include.length > 0 ? {attributes, include} : {attributes}
  model.findById(id, options).then( item => {
    // logout passport to end access token immediately
    // convert back to base64 string
    res.send(item)
  })   
}

export const getDeleteRouter = (model) => (req, res) => {
  authorize(req)
  const {id} = req.params
  model.destroy({
    where:{id}
  })
  .then(deletedNumber => res.send({deletedNumber}))
}