
import { mongoose, Schema } from 'models/mongodb/config'

// schema is just for default value, conversion..v..v
// must define here so we can update
export default mongoose.model('notifications', Schema({  
  title: { type: String },
  content: { type: String },
  createdDate: { type: Date } 
},{collection:'notificationList'}))