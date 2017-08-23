import {Router} from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { jwtSecret }   from 'config/constants'
import passport from 'passport/local'
import { comparePassword, encryptPassword } from 'passport/password-crypto'
import authorize from 'passport/authorize'

const router  = new Router()

const doLogin = (req, res, next ) => {  
  passport.authenticate('local', {session:false}, (err, user, info) => {    
    if (err) {       
      console.error(err.stack)
      return res.status(401).send(err.message)
    }    
    // not error, user is existed, bind it to request
    if(!user)
      return res.status(401).send('Email or password is not correct!!!')

    // default process more
    req.user = user    
    // next filter
    next()    
  })(req, res, next)
}

const generateAccessToken = (req, res, next) => {  
  // we just get back user with id and email is good enough  
  // we use role to differentiate with other users
  jwt.sign(req.user, jwtSecret, {
    // just 1 day, user can refresh token automatically at client, otherwise one year for permanent
    // even permanent still expired
    expiresIn: 60*60*24*(req.query.permanent === 'true' ? 365 : 1),   
  },(err, accessToken) => {    
    req.token = {
      accessToken,
    }
    next()
  })  
}

// now we route it, from the root
router.post('/login', doLogin, generateAccessToken, ({user, token}, res) => {    
  res.send({
    user,
    token,
  })
})

// we just logout the passport, then redirect to home page or login page
// we do not use session, if you use it you have to redirect in req.session.destroy(function (err) {})
router.post('/logout', (req, res) => {

  if(!req.user){
    return res.status(204).end()
  }
 
  // logout passport to end access token immediately
  req.logout()
  
})

router.post('/update', async (req, res)=>{
  
  try{
    authorize(req)
    const {password, new_password} = req.body
    const user = await models.accounts.findById(req.user._id)
    console.log(user.encrypted_password, password)
    const checkPassword = await comparePassword(password, user.encrypted_password)
    if(!checkPassword){
      throw new Error('password is not correct')      
    }
    
    user.encrypted_password = await encryptPassword(new_password)
    user.save()  
    res.send({success:true})
  } catch(ex){
    res.status(400).end()   
  }
    
})

export default router

