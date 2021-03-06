import { takeLatest, takeEvery, all } from 'redux-saga/effects'

import api from 'store/api'
import { createRequestSaga } from 'store/sagas/common'
import { setToast, noop, forwardTo } from 'store/actions/common'

import { 
  setAuthState,   
  saveLoggedUser, 
  removeLoggedUser 
} from 'store/actions/auth'


const requestLoginFacebookAsync = createRequestSaga({
  request: api.auth.loginFacebook,
  key: 'loginFacebook',
  cancel: 'app/logout',
  success: [   
    (data) => saveLoggedUser(data),       
    () => setAuthState(true),
    () => setToast('Logged successfully!!!'), 
    // () => forwardTo('/dashboard'),
  ],
  failure: [ 
    () => setToast('Couldn\'t login', 'error') 
  ],
})


const requestLoginGoogleAsync = createRequestSaga({
  request: api.auth.loginGoogle,
  key: 'loginGoogle',
  cancel: 'app/logout',
  success: [   
    (data) => saveLoggedUser(data),   
    () => setAuthState(true),    
    () => setToast('Logged successfully!!!'), 
    // () => forwardTo('/dashboard'), // action creator may return nothing to match
  ],
  failure: [ 
    () => setToast('Couldn\'t login', 'error') 
  ],
})

const requestLoginAsync = createRequestSaga({
  request: api.auth.login,
  key: 'login',
  cancel: 'app/logout',
  success: [   
    (data) => saveLoggedUser(data),   
    () => setAuthState(true),    
    () => setToast('Logged successfully!!!'), 
    () => forwardTo('/admin'), // action creator may return nothing to match
  ],
  failure: [ 
    () => setToast('Couldn\'t login', 'error') 
  ],
})


const requestUpdateAccountAsync = createRequestSaga({
  request: api.auth.updateAccount,
  key: 'updateAccount',
  cancel: 'app/updateAccount',
  success: [        
    () => setToast('Update Account successfully!!!'),   
    () => forwardTo('/admin'),  
  ],
  failure: [ 
    () => setToast('Couldn\'t update', 'error') 
  ],
})


const requestLogoutAsync = createRequestSaga({
  request: api.auth.logout,
  key: 'logout',
  success: [       
    () => removeLoggedUser(),    
    () => setAuthState(false),  
    () => setToast('Logout successfully!!!'),  
    () => forwardTo('/login'),
  ],
  failure: [ 
    () => setToast('Couldn\'t logout', 'error') 
  ],
})



// root saga reducer
const asyncAuthWatchers = [
  // like case return, this is take => call
  // inner function we use yield*
  // from direct watcher we just yield value
  function* asyncLoginFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([      
      takeLatest('app/loginFacebook', requestLoginFacebookAsync),
      takeLatest('app/loginGoogle', requestLoginGoogleAsync),
      takeLatest('app/login', requestLoginAsync),
      takeLatest('app/updateAccount', requestUpdateAccountAsync),      
    ])
  },

  function* asyncLogoutFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      takeLatest('app/logout', requestLogoutAsync),      
    ])
  }
]

export default asyncAuthWatchers

