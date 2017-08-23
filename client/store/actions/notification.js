// args to invoke service

export const getNotification = (...args) => ({
  type: 'app/getNotification',
  args,
})

export const getNotifications = (...args) => ({
  type: 'app/getNotifications',
  args,
})

export const deleteNotification = (...args) => ({
  type: 'app/deleteNotification',
  args,
})

export const updateNotification = (...args) => ({
  type: 'app/updateNotification',
  args,
})

export const notiMessage = (...args) => ({
  type: 'app/notiMessage',
  args,
})


// payload to replace store
export const replaceNotification = (data) => ({
  type: 'app/replaceNotification',
  payload: data,
})

export const replaceNotifications = (data) => ({
  type: 'app/replaceNotifications',
  payload: data,
})