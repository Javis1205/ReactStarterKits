import { fetchJson, fetchJsonWithToken } from './common'

export default {

  getEvent(id){
    return fetchJson(`/api/events/index/${id}`)
  },

  addEvent(token, user_id){
    return fetchJsonWithToken(token, `/api/events/add/${user_id}`)
  },
  
  crawlEvent(token, user_id){
    return fetchJsonWithToken(token, `/api/events/crawl/${user_id}`)
  },

  getEvents(page, limit=10, where={}){    
    return fetchJson(`/api/events?page=${page}&limit=${limit}`)
  },  

  deleteEvent(token, id){    
    return fetchJsonWithToken(token, `/api/events/delete/${id}`,
    {
      method: 'DELETE',
    }) 
  }
}