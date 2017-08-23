import { fork, all } from 'redux-saga/effects'

import asyncAuthWatchers from './auth'
import asyncUserFetchWatchers from './user'
import asyncNotificationFetchWatchers from './notification'

// saga must be a function like generator of other functions
const rootSaga = function* () {
  yield all([       
    ...asyncAuthWatchers.map(watcher => fork(watcher)),    
    ...asyncUserFetchWatchers.map(watcher => fork(watcher)),
    ...asyncNotificationFetchWatchers.map(watcher => fork(watcher)),
  ])
}

export default rootSaga