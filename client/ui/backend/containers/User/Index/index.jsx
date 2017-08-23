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
import ActionVisibility from 'material-ui/svg-icons/action/check-circle'
import ActionVisibilityOff from 'material-ui/svg-icons/toggle/radio-button-unchecked'
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

import UserFilter from './components/filter'
import Toggle from 'material-ui/Toggle'

import { getUsers, getUser, toggleBlockUser, deleteUser, notiUser } from 'store/actions/user'
import { setToast } from 'store/actions/common'

import {grey600, lightBlue500} from 'material-ui/styles/colors'

import * as authSelectors from 'store/selectors/auth'
import * as userSelectors from 'store/selectors/user'

const mapStateToProps = (state) => ({    
  users: userSelectors.getUsers(state),
  token: authSelectors.getToken(state),
})

@connect(mapStateToProps, { getUser, getUsers, setToast, toggleBlockUser, deleteUser, notiUser })
export default class UserIndex extends Component {

  componentDidMount() {
    document.title = 'User Management'
    this.where = {}
    this._handleMovePage(1)
  }

  _handleMovePage = (page) => {
    if(page){
      this.page = page
    }    
    this.props.getUsers(this.page, 10, this.where)
  }

  _handleToggle = (id) => {
    // allow callback function
    this.props.toggleBlockUser(this.props.token, id, (data)=>{
      this.props.setToast('update user successfully!!!')
      this._handleMovePage()
    }, (error)=> this.props.setToast('update user failed!!!'))
  }  

  _handleFilter = where => {
    // update filter
    this.where = where
    this._handleMovePage()
  }

  _handleRemove = (id, username) => {
    // allow callback function
    if (confirm(`Bạn chắc chắn muốn xóa user ${username}?`)){
      this.props.deleteUser(this.props.token, id, (data)=>{
        this.props.setToast('delete user successfully!!!')
        this._handleMovePage()
      }, (error)=> this.props.setToast('delete user failed!!!'))
    }
    
  }

  _handleNoti = (id, name) => {
    this.props.notiUser(this.props.token, id, `${name} mới gia nhập RUDICAF Dating`)
  }

  renderRow(row) {    

    return (
      <TableRow key={row._id} style={inlineStyles.row}>   
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >
          <img src={`/uploads/resources/${row.avatarPath}`} width={100} />          
        </TableRowColumn>     
        <TableRowColumn colSpan="2" style={inlineStyles.rowColumn} >
          {row.name}
        </TableRowColumn>
        <TableRowColumn colSpan="1" style={inlineStyles.rowColumn} >
          {row.gender === 'F' ? "Nữ" : "Name"}
        </TableRowColumn>
        <TableRowColumn colSpan="2" style={inlineStyles.rowColumn} >
          <FormatDate date={row.dob}/>
        </TableRowColumn>
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >
          {row.highestEducationLevel} - {row.latestCollege}
        </TableRowColumn>
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >
          {row.position}
        </TableRowColumn>
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >
          {row.hobby}
        </TableRowColumn>
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >          
          
          <Link to={`/admin/users/${row._id}/edit`}>
            <IconButton disableTouchRipple >
              <EditorModeEdit />
            </IconButton>
          </Link> 
                           
          <IconButton>
            {!row.active 
              ? <ActionVisibilityOff name="in-visible-icon" color={grey600} />
              : <ActionVisibility name="visible-icon" color={lightBlue500} />
            }
          </IconButton>                  

          <IconButton
            name="delete-button"
            onClick={e=>this._handleRemove(row._id, row.username)}
            disableTouchRipple
          >
            <ActionDelete/>
          </IconButton>

          <IconButton
            tooltip="Send notification"
            tooltipPosition="top-left"
            onClick={e=>this._handleNoti(row._id, row.name)}
          >
            <SocialNotification/>
          </IconButton>

        </TableRowColumn>
      </TableRow>
    )
  }  


  render() {

    const {users:{rows=[], count=0, offset=0} } = this.props  
    return (
      <section>   

        <Link to="/admin/users/new">
          <FloatingActionButton style={inlineStyles.floatButton} disableTouchRipple={true}>
            <ContentAdd />
          </FloatingActionButton>
        </Link>     

        <h1>Quản lý người dùng</h1>

        <UserFilter onFilter={this._handleFilter} />

        <Table fixedHeader fixedFooter>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow selectable={false}>              
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                Ảnh đại diện
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="2" style={inlineStyles.headerColumn}>
                Tên
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="1" style={inlineStyles.headerColumn}>
                Giới tính
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="2" style={inlineStyles.headerColumn}>
                Năm sinh
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                Tốt nghiệp
              </TableHeaderColumn> 
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                Vị trí, chức danh và nơi làm việc
              </TableHeaderColumn>              
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                Sở thích
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                Sửa / Kích hoạt / Xóa
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
