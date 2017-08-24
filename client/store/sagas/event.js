import { takeLatest, takeEvery, all } from 'redux-saga/effects'

import api from 'store/api'
import { setToast, forwardTo, invokeCallback } from 'store/actions/common'
import { replaceEvents } from 'store/actions/event'


import {     
  createRequestSaga
} from 'store/sagas/common'

const getEventsAsync = createRequestSaga({
  request: api.event.getEvents,
  key: 'getEvents',
  success: [   
    (data) => replaceEvents(data),        
  ],
})

const deleteEventAsync = createRequestSaga({
  request: api.event.deleteEvent,
  key: 'deleteEvent',
})

// root saga reducer
export default [
  // watcher for schedule, define term here
  function* eventWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      takeLatest('app/getEvents', getEventsAsync),      
      // run multi      
      takeEvery('app/deleteEvent', deleteEventAsync),
    ])
  }
]

