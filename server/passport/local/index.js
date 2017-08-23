// we use single refreshtoken so other will be reject when we login again
import passport from 'passport'
// can be facebook, google...
import LocalStrategy from 'passport-local'
import {comparePassword} from 'passport/password-crypto'
// extend strategy
passport.use(new LocalStrategy(async (email, password, done) => {
  
    return done(null, user)  

    done(null, null)        
  
}))

export default passport