import models from 'models'
import {encryptPassword,comparePassword} from 'passport/password-crypto'

// Create the tables:
models.authors.sync()

// insert data
// for (var i=1;i<=20;i++) {
//   models.test.create({  
//     name: `Test ${i}`,  
//   })
// }

encryptPassword('123456').then(encrypted_password=>
  models.authors.create({
    email:'admin3@example.com',
    name: 'Admin',
    encrypted_password, 
  })
)