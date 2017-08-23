
import { mongoose, Schema } from 'models/mongodb/config'

// schema is just for default value, conversion..v..v
export default mongoose.model('accounts', Schema({
  username: { type: String },
  encrypted_password: { type: String },
},{collection:'accountList'}))
