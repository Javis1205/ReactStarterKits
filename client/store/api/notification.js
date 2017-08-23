import { fetchJson, fetchJsonWithToken } from './common'

export default {

  getNotification(id){
    return fetchJson(`/api/notification/index/${id}`)
  },
  
  getNotifications(page, limit=10, where={}){    
    return fetchJson(`/api/notification?page=${page}&limit=${limit}`)
  },  

  updateNotification(token, id, item) {
    return fetchJsonWithToken(token, '/api/notification/update',
    {
      method: 'POST',
      body: JSON.stringify({ id, item }),
    })      
  },

  notiMessage(token, id, message) {
    return fetchJsonWithToken(token, '/api/notification/notiMessage',
    {
      method: 'POST',
      body: JSON.stringify({ id, message }),
    })      
  },

  deleteNotification(token, id){    
    return fetchJsonWithToken(token, `/api/notification/delete/${id}`,
    {
      method: 'DELETE',
    }) 
  }
}