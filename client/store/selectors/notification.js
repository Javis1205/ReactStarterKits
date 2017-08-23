
export const getNotification = (state) =>
  state.notification.item || {}

export const getNotifications = (state) =>
  state.notification.items || {}