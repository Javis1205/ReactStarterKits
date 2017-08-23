import React from 'react'
import { Route, IndexRoute } from 'react-router-dom'

import NotFound from './shared/containers/notFound'
import App from './shared/containers/App'

import LoginPage from './backend/containers/Account/Login'
import HomeBackend from './backend/containers/Home'
import AccountForm from './backend/containers/Account/Form'
import UserPage from './backend/containers/User/Index'
import UserFormEdit from './backend/containers/User/Form/edit'
import NotificationPage from './backend/containers/Notification/Index'
import NotificationFormEdit from './backend/containers/Notification/Form/edit'
import HomePage from './frontend/containers/Home/Index'

import * as authSelectors from 'store/selectors/auth'

const checkAuth = (store) => {
  return (nextState, replace) => {    
    const loggedIn = authSelectors.isLogged(store.getState())

    if(!loggedIn) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      }) 
    }        
  }
}
export const Routes = (store) => (

<div>
        <Route exact path="/" component={HomePage}/>
      </div>
)

// export const Routes = (store) => (
//   <Route path='/'>       
//     <IndexRoute component={HomePage} />
//     <Route path='/login' component={LoginPage} />        
//     <Route onEnter={checkAuth(store)} path='/admin' component={App}>          
//       <IndexRoute component={HomeBackend} />  
//       <Route path="account/edit" component={AccountForm} />
//       <Route path="users" component={UserPage} />
//       <Route path="users/new" component={UserFormEdit} />
//       <Route path="users/:id/edit" component={UserFormEdit} />
//       <Route path="notifications" component={NotificationPage} />
//       <Route path="notifications/new" component={NotificationFormEdit} />
//       <Route path="notifications/:id/edit" component={NotificationFormEdit} />
//     </Route>
//     <Route path="*" component={NotFound} />
//   </Route>  
// )