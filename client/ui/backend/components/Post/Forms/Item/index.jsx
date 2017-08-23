import React from 'react'
import Preview from './Preview'
import Form from './Form'

const Item = (props) => (
  <li>
  {props.item.editing
    ? <Form {...props} />
    : <Preview {...props} />
  }
  </li>  
)

export default Item
