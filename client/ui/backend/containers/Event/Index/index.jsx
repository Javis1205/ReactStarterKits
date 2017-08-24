import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import JSONTree from 'react-json-tree'
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
import TextField from 'material-ui/TextField'
import ActionDelete from 'material-ui/svg-icons/action/delete'
import ActionEvent from 'material-ui/svg-icons/action/event'
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit'

import IconButton from 'material-ui/IconButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import Pagination from 'ui/backend/components/shared/Pagination'
import FormatDate from 'ui/backend/components/Format/Date'
import inlineStyles from 'ui/shared/styles/MaterialUI'

import * as eventActions from 'store/actions/event'
import * as commonActions from 'store/actions/common'

import * as authSelectors from 'store/selectors/auth'
import * as eventSelectors from 'store/selectors/event'

import { ERRORS } from 'store/constants/api'
import api from 'store/api'

const mapStateToProps = (state) => ({    
  event: eventSelectors.getEvents(state),
  token: authSelectors.getToken(state),
})

@connect(mapStateToProps, { ...eventActions, ...commonActions })
export default class extends Component {

  state={
    open: false
  }

  componentDidMount() {
    document.title = 'Events Management'
    this.where = {}
    this._handleMovePage(1)
  }

  _handleMovePage(page){
    if(page){
      this.page = page
    }    
    this.props.getEvents(this.page, 10, this.where)
  }

  _handleRemove(id, user_id){
    if (confirm(`You want to delete ${user_id}?`)){
      this.props.deleteEvent(this.props.token, id, (err, data)=>{        
        if(err){
          this.props.setToast('delete events failed!!!')
        } else {
          this.props.setToast('delete events successfully!!!')
          this._handleMovePage()
        }        
      })
    }    
  }

  async _handleCrawl(id, user_id, index){
    const {token, event} = this.props
    const ret = await api.event.crawlEvent(token, user_id)    
    const newEvent = {...event}
    newEvent.rows[index].data = ret.data
    this.props.replaceEvents(newEvent)
  }

  renderRow(row, index) {  
    return (
      <TableRow key={row.id} style={inlineStyles.row}>   
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >
          {row.user_id}
        </TableRowColumn>  
        <TableRowColumn colSpan="10" style={inlineStyles.rowColumn} >
          <div className="events">
            <JSONTree data={row.data||{}} hideRoot={true}/>
          </div>
        </TableRowColumn>                
        <TableRowColumn colSpan="3" style={inlineStyles.rowColumn} >                            
          <IconButton 
            onClick={e=>this._handleCrawl(row.id, row.user_id, index)}
            disableTouchRipple >
            <ActionEvent/>
          </IconButton>
                               
          <IconButton            
            onClick={e=>this._handleRemove(row.id, row.user_id)}
            disableTouchRipple
          >
            <ActionDelete/>
          </IconButton>

        </TableRowColumn>
      </TableRow>
    )
  }  

  handleOpen = () => {
    this.setState({open: true});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  handleSubmit = async ()=>{
    const {token, setToast} = this.props
    const user_id = this.userIdField.input.value.trim()
    if(user_id){
      const ret = await api.event.addEvent(token, user_id)
      if(ret.success){
        setToast('Create event successfully!')
        this._handleMovePage()
        this.handleClose()
      } else {
        setToast(ERRORS[ret.code]||'Create event failed!')
      } 
    } else {
      this.handleClose()
    }    
  }


  render() {  
    const {event} = this.props
    const {rows, count, offset} = (event && event.rows) ? event : {rows:[], count:0, offset:0}    
    return (
      <section>   

        <Dialog
          title="Create new Events for Celebrity"
          actions={[
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleClose}
            />,
            <FlatButton
              label="Submit"
              primary={true}
              keyboardFocused={true}
              onClick={this.handleSubmit}
            />,
          ]}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            ref={ref=>this.userIdField = ref}
            hintText="Facebook User ID"
          />
        </Dialog>

        
        <FloatingActionButton onClick={this.handleOpen} style={inlineStyles.floatButton} disableTouchRipple={true}>
          <ContentAdd />
        </FloatingActionButton>
        

        <h1>Event management</h1>      

        <Table fixedHeader fixedFooter>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow selectable={false}>              
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                User ID
              </TableHeaderColumn>
              <TableHeaderColumn colSpan="10" style={inlineStyles.headerColumn}>
                Event
              </TableHeaderColumn>                      
              <TableHeaderColumn colSpan="3" style={inlineStyles.headerColumn}>
                Crawl / Delete
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
           
          {rows.map((row, index) => this.renderRow(row, index))}

          </TableBody>
          <TableFooter>
            <TableRow>
              <TableRowColumn>                

                <Pagination
                  offset={offset}
                  total={count}
                  limit={10}
                  handlePageClick={page=>this._handleMovePage(page)}
                />
              
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    )
  }
}
