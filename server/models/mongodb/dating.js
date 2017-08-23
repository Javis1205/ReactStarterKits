import { mongoose, Schema } from 'models/mongodb/config'

// schema is just for default value, conversion..v..v
// must define here so we can update
export default mongoose.model('datings', Schema({  
  datetime: { type: Date },
  content: { type: String },
  address: { type: String },
  from: { type: String },
  to: { type: String },
  createdDate: { type: Date },
  status: { type: String },
  denyingMessage: { type: String },
  acceptingMessage: { type: String },
  lastModified: { type: Date } 
},{collection:'dateList'}))