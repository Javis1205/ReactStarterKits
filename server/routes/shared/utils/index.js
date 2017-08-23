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

}

export const getDetailRouter = (model, attributes, include=[]) => (req, res) => {
  // tag is public
  const {id} = req.params
  const options = include.length > 0 ? {attributes, include} : {attributes}
  
}

export const getDeleteRouter = (model) => (req, res) => {
  const {id} = req.params
}