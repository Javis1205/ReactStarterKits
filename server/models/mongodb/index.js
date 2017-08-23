
import { mongoose, Schema } from './config'


import user from './user'
import account from './account'
import notification from './notification'
import dating from './dating'

const models = { mongoose, Schema }
// choose model to init
const tables = [
  user,  
  account, 
  notification,
  dating,
]

tables.forEach(model => models[model.modelName] = model)

// back reference
mongoose.models = models

// export default
export default models
