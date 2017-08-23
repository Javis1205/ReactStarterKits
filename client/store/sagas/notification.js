import { takeLatest, takeEvery, all } from 'redux-saga/effects'

import api from 'store/api'
import { setToast, forwardTo, invokeCallback } from 'store/actions/common'
import { replaceNotification, replaceNotifications } from 'store/actions/notification'


import {     
  createRequestSaga
} from 'store/sagas/common'

// rarely all models are treated the same, so make a template like this for later modification
const requestGetNotificationAsync = createRequestSaga({
  request: api.notification.getNotification,
  key: 'getNotification',
  success: [   
    (data) => replaceNotification(data),    
    (data, {args:[id, callback]}) => invokeCallback(callback, data),
  ],
  failure: [
    (data, {args:[id, callback, error]}) => invokeCallback(error, data),
  ]
})

const requestGetNotificationsAsync = createRequestSaga({
  request: api.notification.getNotifications,
  key: 'getNotifications',
  success: [   
    (data) => replaceNotifications(data),        
  ],
})

const requestUpdateNotificationAsync = createRequestSaga({
  request: api.notification.updateNotification,
  key: 'updateNotification',
  success: [   
    () => setToast('Update notification successfully!!!'),     
    ({id}) => forwardTo('/admin/notifications'),        
  ],
  failure: [
    (error) => setToast(error.message)
  ]
})

const requestDeleteNotificationsAsync = createRequestSaga({
  request: api.notification.deleteNotification,
  key: 'deleteNotification',
  success: [   
    // you can return other action from callback, such as getPage
    (data, {args:[token, id, callback]}) => invokeCallback(callback, data),
  ],
  failure: [
    (data, {args:[token, id, callback, error]}) => invokeCallback(error, data),
  ]
})

const requestNotiMessageAsync = createRequestSaga({
  request: api.notification.notiMessage,
  key: 'notiMessage',
  timeout: 1000000,
  success: [   
    () => setToast('Notify user successfully!!!'),              
  ],
  failure: [
    (error) => setToast(error.message)
  ]
})

// root saga reducer
export default [
  // watcher for schedule, define term here
  function* asyncNotificationFetchWatcher() {
    // use takeLatest instead of take every, so double click in short time will not trigger more fork
    yield all([
      takeLatest('app/getNotification', requestGetNotificationAsync),
      takeLatest('app/getNotifications', requestGetNotificationsAsync),
      takeLatest('app/updateNotification', requestUpdateNotificationAsync),
      takeLatest('app/notiMessage', requestNotiMessageAsync),
      // run multi      
      takeEvery('app/deleteNotification', requestDeleteNotificationsAsync),
    ])
  }
]

