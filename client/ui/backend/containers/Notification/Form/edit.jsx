import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { Field, FieldArray, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentSave from 'material-ui/svg-icons/content/save'


import { 
  renderTextField,
} from 'ui/backend/shared/utils'

import ErrorMessage from 'ui/shared/components/ErrorMessage'
import inlineStyles from 'ui/shared/styles/MaterialUI'

import { getNotification, updateNotification, replaceNotification } from 'store/actions/notification'

import * as authSelectors from 'store/selectors/auth'
import * as notificationSelectors from 'store/selectors/notification'


// higher order function for redux form and connect to store
const validate = (values) => {
  const errors = {}
  if (!values.title) 
    errors.title = 'Enter Title'
  if (!values.content) 
    errors.content = 'Enter Content'
  
  return errors
}

const mapStateToProps = (state) => ({  
  initialValues: notificationSelectors.getNotification(state),
  token: authSelectors.getToken(state),
})

@connect(mapStateToProps, { getNotification, updateNotification, replaceNotification })
@reduxForm({ form: 'NotificationForm', validate, enableReinitialize:true  })
export default class NotificationForm extends Component {

  _handleSubmit = (props) => {    
    // call update, after that return to list page
    this.props.updateNotification(this.props.token, this.props.params.id, props)
    // console.log(props)
  }

  componentDidMount(){
    if(this.props.params.id){
      this.props.getNotification(this.props.params.id)
      document.title = 'Sửa thông báo'
    } else {
      document.title = 'Thêm thông báo'  
      this.props.replaceNotification({})
    }
    
  }

  render() { 
    const { params:{id}, handleSubmit, submitting } = this.props    
    const submitLabel = !id ? 'Thêm' : 'Sửa'    
    return (

      <form onSubmit={handleSubmit(this._handleSubmit)} className="form" >
      
        <h2>{submitLabel} Thông báo</h2>
        
        <Field name="title" label="Tiêu đề" component={renderTextField} />
        <Field name="content" label="Nội dung" multiLine={true} rows={2} component={renderTextField} />                    
        

        <FloatingActionButton label={submitLabel} type="submit"
          style={inlineStyles.floatButton} disabled={submitting} disableTouchRipple={true}>
          <ContentSave />
        </FloatingActionButton>

      </form>

    )
  }

}





