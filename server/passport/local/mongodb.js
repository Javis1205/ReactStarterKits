// we use single refreshtoken so other will be reject when we login again
import passport from 'passport'
// can be facebook, google...
import LocalStrategy from 'passport-local'
import models from 'models/mongodb'
import {comparePassword} from 'passport/password-crypto'
// extend strategy
passport.use(new LocalStrategy(async (username, password, done) => {


    const row = await models.accounts.findOne({username}).select({username:1,encrypted_password:1})  

    if(row){
      // destructor from field, not promise
      const {encrypted_password, ...user} = row._doc      
      const checkPassword = await comparePassword(password, encrypted_password)
      if(checkPassword) {    
        user.role = 'admin'          
        return done(null, user)        
      }
    }  

    done(null, null)        
  
}))

export default passport