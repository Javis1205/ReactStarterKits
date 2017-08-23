import authorize from 'passport/authorize'
import StatusCode from 'routes/status'

const respondMessage = (code, message, res) => 
  res.send({code, message})  

export const getPagingRouter =  (model, fields, where, order) => async (req, res)=> {  
  const {page=1, limit=10} = req.query  
  const maxLimit = Math.min(+limit, 10)
  const offset = (page-1) * limit
  const options = {
    limit: maxLimit,
    offset,
    fields,    
  }

  if(typeof fields !== 'string')
    options.fields = options.fields.join(' ')
  
  if(where){
    options.where = typeof where === 'function' ? where(req) : where
  }
  if(order){
    options.order = typeof order === 'function' ? order(req) : order
  }
  const count = await model.count(options.where)

  try{
    const rows = await model.find(options.where).select(fields).limit(options.limit).skip(options.offset).sort(options.order)
    res.send({rows, count, offset,code: StatusCode.OK})      
  }catch(ex){
    res.send({code: StatusCode.SERVER_ERROR, message: ex.message})
  }
}

export const getDetailRouter = (model, fields) => async (req, res) => {
  // tag is public
  const {id} = req.params
  const options = {fields:(typeof fields !== 'string') ? fields.join(' ') : fields}
  const item = await model.findById(id).select(options.fields)
  res.send(item)  
}

export const getDeleteRouter = (model) => (req, res) => {
  authorize(req)
  const {id} = req.params
  model.remove({_id:id}, err=>res.send({id}))
}