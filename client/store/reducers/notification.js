
export const notificationReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case 'app/replaceNotification':
      return { ...state, item: payload } 
    case 'app/replaceNotifications':
      return { ...state, items: payload }   
    default:
      return state
  }

}

