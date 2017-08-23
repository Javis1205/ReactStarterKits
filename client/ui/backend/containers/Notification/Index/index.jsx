import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { Link } from 'react-router-dom'
import NoContent from 'ui/shared/components/NoContent'
import {
  Table,
  TableHeaderColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table'

import ActionDelete from 'material-ui/svg-icons/action/delete'
import ActionVisibility from 'material-ui/svg-icons/action/visibility'
import ActionVisibilityOff from 'material-ui/svg-icons/action/visibility-off'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import SocialNotification from 'material-ui/svg-icons/social/notifications'

import IconButton from 'material-ui/IconButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import Pagination from 'ui/backend/components/shared/Pagination'
import FormatDate from 'ui/backend/components/Format/Date'
import inlineStyles from 'ui/shared/styles/MaterialUI'

import { getNotifications, getNotification, deleteNotification, notiMessage } from 'store/actions/notification'
import { setToast } from 'store/actions/common'

import * as authSelectors from 'store/selectors/auth'
import * as notificationSelectors from 'store/selectors/notification'


const mapStateToProps = (state) => ({    
  notifications: notificationSelectors.getNotifications(state),
  token: authSelectors.getToken(state),
})

@connect(mapStateToProps, { getNotification, getNotifications, setToast, deleteNotification, notiMessage })
export default class NotificationIndex extends Component {

  componentDidMount() {
    document.title = 'Notification Management'
    this.where = {}
    this._handleMovePage(1)
  }

  _handleMovePage = (page) => {
    if(page){
      this.page = page
    }    
    this.props.getNotifications(this.page, 10, this.where)
  }

  _handleToggle = (id) => {
    // allow callback function
    this.props.toggleBlockNotification(this.props.token, id, (data)=>{
      this.props.setToast('update notification successfully!!!')
      this._handleMovePage()
    }, (error)=> this.props.setToast('update notification failed!!!'))
  }  

  _handleRemove = (id, title) => {
    // allow callback function
    if (confirm(`Bạn chắc chắn muốn xóa notification ${title}?`)){
      this.props.deleteNotification(this.props.token, id, (data)=>{
        this.props.setToast('delete notification successfully!!!')
        this._handleMovePage()
      }, (error)=> this.props.setToast('delete notification failed!!!'))
    }
    
  }

  _handleNoti = (id, title) => {
    this.props.notiMessage(this.props.token, id, title)
  }

  renderRow(row) {    

    return (
      <TableRow key={row._id} style={inlineStyles.row}>   
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >
          {row.title}
        </TableRowColumn>  
        <TableRowColumn colSpan="10" style={inlineStyles.rowColumn} >
          {row.content}
        </TableRowColumn>        
        <TableRowColumn colSpan="2" style={inlineStyles.rowColumn} >          
          <FormatDate date={row.createdDate}/>
        </TableRowColumn>        
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >          
          
          <Link to={`/admin/notifications/${row._id}/edit`}>
            <IconButton disableTouchRipple >
              <EditorModeEdit />
            </IconButton>
          </Link>                            
          <IconButton
            name="delete-button"
            onClick={e=>this._handleRemove(row._id, row.title)}
            disableTouchRipple
          >
            <ActionDelete/>
          </IconButton>

          <IconButton
            tooltip="Send notification"
            tooltipPosition="top-left"
            onClick={e=>this._handleNoti(row._id, row.title)}
          >
            <SocialNotification/>
          </IconButton>

        </TableRowColumn>
      </TableRow>
    )
  }  


  render() {

    const {notifications:{rows=[], count=0, offset=0} } = this.props  
    return (
      <section>   

        <Link to="/admin/notifications/new">
          <FloatingActionButton style={inlineStyles.floatButton} disableTouchRipple={true}>
            <ContentAdd />
          </FloatingActionButton>
        </Link>     

        <h1>Quản lý thông báo</h1>      

        <Table fixedHeader fixedFooter>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow selectable={false}>              
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                Tiêu đề
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="10" style={inlineStyles.headerColumn}>
                Nội dung
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="2" style={inlineStyles.headerColumn}>
                Ngày tạo
              </TableHeaderColumn>              
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                Sửa / Xóa
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
           
          {rows.map(row => this.renderRow(row))}

          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn>                

                <Pagination
                  offset={offset}
                  total={count}
                  limit={10}
                  handlePageClick={this._handleMovePage}
                />
              
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    )
  }
}
