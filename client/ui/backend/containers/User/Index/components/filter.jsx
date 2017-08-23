import React, { Component, PropTypes } from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import MenuItem from 'material-ui/MenuItem'

import { 
  renderTextField, 
  renderSelectField, 
} from 'ui/backend/shared/utils'

import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'

const validate = (values) => {
  const errors = {}
  // validate logic
  return errors
}

const mapStateToProps = (state) => ({  
  initialValues: {gender: 'A'},
})

// @withRouter
@connect(mapStateToProps)
@reduxForm({ form: 'UserFilterForm', validate })
export default class UserFilter extends Component {

  static propTypes = {    
    onFilter: PropTypes.func.isRequired,
  }

  _handleFilter = props => {
    this.props.onFilter && this.props.onFilter(props)
  }

  render() {    
    const { handleSubmit, submitting } = this.props
    return (
      <div className="filter-box">
        <form className="form" onSubmit={handleSubmit(this._handleFilter)} >        
          <h3 className="mt-0">Bộ lọc</h3>
          <Divider/>
          <div className="row m-0">            
            <div className="col-sm-3 pl-0">
              <Field name="name" label="Tên" component={renderTextField} />
            </div>
            <div className="col-sm-1">
              <Field name="age" type='number' label="Tuổi" component={renderTextField} />
            </div>
            <div className="col-sm-3">
              <Field name="address" label="Địa chỉ" component={renderTextField} />
            </div>
            <div className="col-sm-2">
              <Field name="gender" label="Giới tính" component={renderSelectField}>
                <MenuItem value='A' primaryText="Tất cả" />
                <MenuItem value='F' primaryText="Nữ" />
                <MenuItem value='M' primaryText="Nam" />
              </Field>
            </div>
            <div className="col-sm-3 pr-0">
              <Field name="highestEducationLevel" label="Trình độ học vấn" component={renderTextField} />                          
            </div>
          </div>
          <div className="row m-0 mt-20">             
            <div className="pull-right">
              <RaisedButton secondary={true} label='Tìm kiếm' type='submit' disabled={submitting}  />                            
            </div>
          </div>
        </form>
      </div>
    )
  }


}