import { sequelize, DataTypes } from './config'
import dataloaderSequelize from 'data/loader/sequelize'

// import user from './user'

const models = { sequelize, DataTypes }
// choose model to init
const tables = [
  // user, 
]

tables.forEach(model => models[model.name] = model)

// back reference
sequelize.models = models
dataloaderSequelize(sequelize)

// mapping for associate, after all models have been attached to models
tables.forEach(model => model.associate && model.associate.call(model))

export default models