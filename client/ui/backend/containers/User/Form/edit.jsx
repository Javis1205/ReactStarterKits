import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm } from 'redux-form'

import MenuItem from 'material-ui/MenuItem'
import Checkbox from 'material-ui/Checkbox'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentSave from 'material-ui/svg-icons/content/save'
import Subheader from 'material-ui/Subheader'

import inlineStyles from 'ui/shared/styles/MaterialUI'

import { getUser, updateUser, replaceUser } from 'store/actions/user'
import SelectField from 'material-ui/SelectField'

import * as authSelectors from 'store/selectors/auth'
import * as UserSelectors from 'store/selectors/user'


import { 
  renderTextField, 
  renderDropzoneImage, 
  renderDropzoneImages, 
  renderSelectField, 
  renderDatePicker,
  renderCheckbox,
  renderCheckBoxs,
} from 'ui/backend/shared/utils'

import options from './options'

const validate = (values) => {
  const errors = {}
  // first time it is empty
  if(!values) return errors
  if (!values.name) 
    errors.name = 'Điền họ và tên'
  if(!values.nameInApp)
    errors.nameInApp = 'Điền tên hiển thị trên App'

  return errors
}      

const mapStateToProps = (state) => {
  const initialValues = UserSelectors.getUser(state)
  initialValues.traits = []
  for(let i=1;i<=5;i++){
    const trait = initialValues['trait'+i] 
    if(trait)
      initialValues.traits.push(trait)
  }   
  return {  
    initialValues,
    token: authSelectors.getToken(state)
  }
} 

@connect(mapStateToProps, {getUser, updateUser, replaceUser})
@reduxForm({ form: 'UserForm', validate, enableReinitialize:true })
export default class UserEdit extends Component {

  state = {
    traits: [],
  }

  _handleSubmit = (props) => {    
    // call update, after that return to list page
    const {traits, ...data} = props
    for(let i=1;i<=5;i++){
      data['trait'+i] = traits[i-1]
    }
    this.props.updateUser(this.props.token, this.props.match.params.id, data)
    // console.log(data)
  }


  componentDidMount(){
    if(this.props.match.params.id){
      this.props.getUser(this.props.match.params.id)
      document.title = 'Sửa người dùng'
    } else {
      document.title = 'Thêm người dùng'  
      this.props.replaceUser({})
    }    
    const {trait1,trait2,trait3,trait4,trait5} = this.props.initialValues
    const selectedTraits = [trait1,trait2,trait3,trait4,trait5]
    // const traits = options.trait1.filter(c=>!selectedTraits.include(c.key))
    console.log(selectedTraits, this.props.initialValues)
    // this.setState({traits})
  }

  _renderSelectFieldChildren = items => {
    return items.map(item => <MenuItem key={item.key} value={item.key} primaryText={item.value} />)
  }
  
  render() {    
    const { match:{params:{id}}, handleSubmit, submitting } = this.props    
    const {traits} = this.state
    const submitLabel = !id ? 'Thêm' : 'Sửa'    
    return (

      <form onSubmit={handleSubmit(this._handleSubmit)} className="form" >
      
        <h2>{submitLabel} Người dùng</h2>
        <div className="row m-0">
          <div className="pl-0 col-md-6">
            <Field name="username" disabled={!!id} label="Tài khoản" component={renderTextField} />
            <Field name="name" label="Họ và tên" component={renderTextField} />
            {
              // <Field name="nameInApp" label="Tên hiển thị trên App" component={renderTextField} />
            }
            <Field name="gender" dropdown={true} label="Giới tính" component={renderSelectField}>              
              <MenuItem value='F' primaryText="Nữ" />
              <MenuItem value='M' primaryText="Nam" />
            </Field>

            {

            // <div className="form mt-40">
            //   <label className="legend">CMND / Hộ chiếu</label>              
            //   <Field name="passport.code" label="Số" component={renderTextField} />
            //   <Field name="createdDate" label="Ngày cấp" component={renderDatePicker} />
            //   <Field name="passport.place" label="Nơi cấp" component={renderTextField} />
            // </div>

            // <Field name="language" label="Ngôn ngữ" component={renderTextField} />

            // <Field name="email" label="Email" component={renderTextField} />
            }
            <Field name="latestCollege" label="Trường tốt nghiệp" component={renderTextField} />
            <Field name="position" label="Chức vụ/Vị trí" component={renderTextField} />

            {
            //<Field name="family" label="Gia đình" component={renderTextField} />

            // <Field name="healthStatus" label="Tình trạng sức khỏe" component={renderTextField} />
          

            // <div className="form mt-40">
            //   <label className="legend">Chỉ số cơ thể</label>              
            //   <Field name="height" label="Chiều cao" component={renderTextField} />              
            //   <Field name="weight" label="Cân nặng" component={renderTextField} />
            // </div>

          

            // <Field name="smokingStatus" dropdown={true} label="Hút thuốc" component={renderSelectField}>              
            //   {this._renderSelectFieldChildren(options.smokingStatus)}                          
            // </Field>

          

            // <Field name="workTimeStatus" dropdown={true} label="Thời gian làm việc" component={renderSelectField}>              
            //   {this._renderSelectFieldChildren(options.workTimeStatus)}            
            // </Field>

          }

            <Field name="favouriteQuotations" label="Câu nói ưa thích" component={renderTextField} />
            {
            //<Field name="vehicle" label="Phương tiện sở hữu" component={renderTextField} />
          }
            <Field name="otherInfo" label="Chia sẻ khác về bản thân" component={renderTextField} />

          </div>


          <div className="pr-0 col-md-6">
            <Field name="password" label="Mật khẩu" component={renderTextField} />
            <Field name="dob" label="Ngày sinh" component={renderDatePicker} />
{
            // <Field name="birthPlace" label="Nơi sinh (Thành phố - quốc gia)" component={renderTextField} />

            // <Field name="nationality" label="Quốc tịch" component={renderTextField} />
            // <Field name="religion" label="Tôn giáo" component={renderTextField} />            
            // <Field name="nation" label="Dân tộc" component={renderTextField} />

            }

            <Field name="address" label="Nơi ở hiện tại" component={renderTextField} />

            {
            // <Field name="livingAddress" label="Nơi sinh sống và làm việc chủ yếu" component={renderTextField} />        
            // <Field name="phone" label="Điện thoại di động" component={renderTextField} />
            }
            <Field name="highestEducationLevel" label="Trình độ học vấn cao nhất" component={renderTextField} />
            <Field name="company" label="Nơi làm việc hiện tại" component={renderTextField} />
{
            // <Field name="income" dropdown={true} label="Mức thu nhập ước lượng hàng tháng" component={renderSelectField}>              
            //   {this._renderSelectFieldChildren(options.income)}            
            // </Field>

            
            //<Field name="relation" label="Quan hệ" component={renderTextField} />
          }
            <Field name="note" label="Ghi chú" component={renderTextField} />

            <Field name="maritalStatus" dropdown={true} label="Tình trạng hôn nhân" component={renderSelectField}>              
              {this._renderSelectFieldChildren(options.maritalStatus)}             
            </Field>
{
            // <Field name="sonNumber" type="number" label="Số con trai" component={renderTextField} />
            // <Field name="daughterNumber" type="number" label="Số con gái" component={renderTextField} />
          

            // <Field name="drinkingStatus" dropdown={true} label="Uống rượu/bia" component={renderSelectField}>              
            //   {this._renderSelectFieldChildren(options.drinkingStatus)}           
            // </Field>  

            }          
            <Field name="hobby" label="Sở thích" component={renderTextField} />
            {
            // <Field name="sport" dropdown={true} label="Có chơi thể thao không?" component={renderSelectField}>              
            //   {this._renderSelectFieldChildren(options.sport)}            
            // </Field>
          

            // <Field name="interestingRelationship" label="Nhu cầu tìm kiếm mối quan hệ" 
            //   items={options.interestingRelationship}
            //   component={renderCheckBoxs} />
}
          </div>
        </div>


        <div className="row m-0">
          <div className="pl-0 col-md-6">

          {
            // <Field name="traits" label="Đặc điểm(tối đa 5)" 
            //   max={5}
            //   items={options.traits}
            //   component={renderCheckBoxs} />                          
            }

            <Field name="avatarPath" label="Avatar" path="/uploads/resources" component={renderDropzoneImage} base64={true} />
            <Field name="active" className="mt-20" label="Trạng thái kích hoạt" component={renderCheckbox}/>
            
          </div>


          <div className="pr-0 col-md-6">
            <Field name="rating" dropdown={true} label="Hạng thành viên" component={renderSelectField}>              
              {this._renderSelectFieldChildren(options.rating)}         
            </Field> 
            <Field name="imagePathList" path="/uploads/resources" label="Cover Image" component={renderDropzoneImages} base64={true} />
          </div>
        </div>                
        

        <FloatingActionButton label={submitLabel} type="submit"
          style={inlineStyles.floatButton} disabled={submitting} disableTouchRipple={true}>
          <ContentSave />
        </FloatingActionButton>

      </form>

    )
  }
}


