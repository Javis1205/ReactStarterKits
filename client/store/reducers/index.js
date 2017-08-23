import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { requests, toast } from './common'
import { reducer as form } from 'redux-form'
import { authReducer as auth } from './auth'
import { userReducer as user } from './user'
import { notificationReducer as notification } from './notification'

// a rootReducer is like a single state, key is function return a sub state value
const rootReducer = combineReducers({
	routing,
  form, // for complex reducer, should put at root
  ui: combineReducers({
    // ui reducer should be placed here    
    toast,
  }),  
  requests,    
  auth,
  user,
  notification,
})

export default rootReducer

