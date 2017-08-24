// we use single refreshtoken so other will be reject when we login again
import passport from 'passport'
// can be facebook, google...
import db from 'data/mysql'
import LocalStrategy from 'passport-local'
import {comparePassword} from 'passport/password-crypto'
// extend strategy
passport.use(new LocalStrategy(async (email, password, done) => {
    
    const [[row]] = await db.query(`
      SELECT id, name, email, encrypted_password, fb_access_token 
      FROM admin_users 
      WHERE email=:email
      LIMIT 1
    `, {email})
    if(row){
      const {encrypted_password, ...user} = row
      const checkPassword = await comparePassword(password, encrypted_password)  
      if(checkPassword){
        return done(null, user)
      }
    }  

    done(null, null)        
  
}))

export default passport