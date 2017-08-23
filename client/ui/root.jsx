import React from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import myTheme from 'ui/shared/theme'

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


const muiTheme = getMuiTheme(myTheme)

const Root = ({ store, history }) => (
	<Provider store={store}>
		<MuiThemeProvider muiTheme={muiTheme}>
      <ConnectedRouter history={history}>
        <Switch>       
          <Route exact path="/" component={HomePage} />
          <Route path='/login' component={LoginPage} />                  
          <App>
            <Route exact path="/admin" component={HomeBackend} />  
            <Route path="/admin/account/edit" component={AccountForm} />
            <Route exact path="/admin/users" component={UserPage} />
            <Route path="/admin/users/new" component={UserFormEdit} />
            <Route path="/admin/users/:id/edit" component={UserFormEdit} />
            <Route exact path="/admin/notifications" component={NotificationPage} />
            <Route path="/admin/notifications/new" component={NotificationFormEdit} />
            <Route path="/admin/notifications/:id/edit" component={NotificationFormEdit} />
          </App>
          <Route path="*" component={NotFound} />
        </Switch>  		
      </ConnectedRouter>
		</MuiThemeProvider>
	</Provider>
)

Root.propTypes = {
	store: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
}

export default Root