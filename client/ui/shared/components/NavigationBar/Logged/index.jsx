import React, { Component } from 'react'import PropTypes from 'prop-types'import { Link } from 'react-router-dom'import { connect } from 'react-redux'import RaisedButton from 'material-ui/RaisedButton'import FontIcon from 'material-ui/FontIcon'import MenuItem from 'material-ui/MenuItem'import Divider from 'material-ui/Divider'import IconMenu from 'material-ui/IconMenu'import IconButton from 'material-ui/IconButton'import ActionCardGiftcard from 'material-ui/svg-icons/action/card-giftcard'import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app'import AVLibraryBooks from 'material-ui/svg-icons/av/library-books'import ImageAudiotrack from 'material-ui/svg-icons/image/audiotrack'import ActionDashboard from 'material-ui/svg-icons/action/dashboard'import LocationOn from 'material-ui/svg-icons/communication/location-on'import AccountCircel from 'material-ui/svg-icons/action/account-circle'import RSSFeed from 'material-ui/svg-icons/communication/rss-feed'import * as authSelectors from 'store/selectors/auth'import AppBar  from 'material-ui/AppBar'import AvWeb from 'material-ui/svg-icons/av/web'import ActionDescription from 'material-ui/svg-icons/action/description'import SocialPerson from 'material-ui/svg-icons/social/person'import Avatar from 'material-ui/Avatar'import config from 'ui/shared/config'import inlineStyles from 'ui/shared/styles/MaterialUI'// actions is map dispatch to props, by default dispatch is pass to if there is no action creator// and ofcourse don't listen to any store (part of the whole state)// later information will be re-hygrate, but this first state is initial from localStorage const mapStateToProps = (state) => ({    user: authSelectors.getUser(state)})@connect(mapStateToProps)export default class NavigationBar extends Component {  _handleLogout = (e) => {    e.preventDefault()    this.props.onLogout && this.props.onLogout()  }  static contextTypes = {    router: PropTypes.object  }  renderAppBarRight() {    const {username} = this.props.user    const avatar = '/images/user2-160x160.jpg'    const anchorOrigin = {horizontal: 'left', vertical: 'bottom'}    const targetOrigin = {horizontal: 'left', vertical: 'top'}    const menus = [      // {title:'Mail', link:'/notification', icon:<AccountCircel color={inlineStyles.iconColor} />},      // {title:'User Management', link:'/cms/users', icon:<AccountCircel color={inlineStyles.iconColor} />},      // {title:'News Post Management', link:'/cms/newsposts', icon:<RSSFeed color={inlineStyles.iconColor} />},      // {title:'Sell Post Management', link:'/cms/sellposts', icon:<AvWeb color={inlineStyles.iconColor} />},      // {title:'Service Point Management', link:'/cms/servicepoints', icon:<LocationOn color={inlineStyles.iconColor} />},    ]    return (      <div>        {/*        <IconMenu          iconButtonElement={            <IconButton              disableTouchRipple={true} >              <ActionDescription color={inlineStyles.iconColor} />            </IconButton>          }          anchorOrigin={anchorOrigin}          targetOrigin={targetOrigin} >                              <MenuItem primaryText="Edit" containerElement={<Link to="/cms/posts" />} />                              <MenuItem primaryText="Preview" containerElement={<Link to="/posts" />} />        </IconMenu>         */}        {menus.map((menu, index)=>(          <Link key={index} to={menu.link} >            <IconButton tooltip={menu.title}             disableTouchRipple={true} >                {menu.icon}            </IconButton>          </Link>        ))}                                        <IconMenu           iconButtonElement={            <IconButton disableTouchRipple={true}>              <Avatar size={24} src={avatar}/>            </IconButton>          }          anchorOrigin={anchorOrigin}          targetOrigin={targetOrigin}        >          <MenuItem             primaryText="Configure"            containerElement={<Link to='/admin/account/edit'/>}            leftIcon={<SocialPerson />}           />          <MenuItem             primaryText="Logout"             onTouchTap={this._handleLogout}            leftIcon={<ActionExitToApp />}           />        </IconMenu>            <div className="pull-right mt-15">Hi {username}</div>          </div>    )  }  render() {    return (      <AppBar        showMenuIconButton={false}                style={inlineStyles.appBar.root}        titleStyle={inlineStyles.appBar.title}                      zDepth={0}        iconStyleRight={inlineStyles.appBar.elementRight}        iconElementRight={this.renderAppBarRight()} />    )  }}