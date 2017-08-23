import models from 'models'
import {encryptPassword,comparePassword} from 'passport/password-crypto'
import statuses from '../data/status'
import fakeShippers from '../data/shippers'
import fakeOrders from '../data/orders'

// Create the tables:
// models.groups.sync()
// models.members.sync()
// models.orders.sync()
// models.messages.sync()
// models.status.sync()
// models.authors.sync()

// models.groups.create({
//     name: 'Admin'
//   })

// cryptPassword('123456').then(encrypted_password=>
//   models.members.create({
//     email:'admin3@example.com',
//     name: 'Admin',
//     encrypted_password, 
//   })
// )

// cryptPassword('123456').then(encrypted_password=>
//   models.members.create({
//     email:'locnt@example.com',
//     name: 'locnt',
//     encrypted_password, 
//   })
// )

// insert data
// for (var i = 0; i < statuses.length; i++) {
// 	console.log("-- " + i + "  : " + JSON.stringify(statuses[i]));
//   models.status.create(statuses[i]);
// }
  
  models.shippers.create(fakeShippers)
  models.orders.create(fakeOrders)

//insert data
// models.groups.create({
//     name: 'Shipper'
// }).then(function(){
// 	cryptPassword('123456').then(encrypted_password=>
// 	  models.authors.create({
// 	    email:'locnt@example.com',
// 	    name: 'Locnt',
// 	    encrypted_password,
// 	    refresh_token : "1234567890",
// 	    group_id : 1
// 	  })
// 	)
// })


//fake data

