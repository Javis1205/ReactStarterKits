import path from 'path'

// must provide public path from current path, or absolute path instead!!!
let publicPathENV = path.resolve(process.env.NODE_PATH || './', process.env.PUBLIC_PATH || 'public')

export const jwtSecret = "4A40333B-EC26-4E18-A976-9B030C23A484"
// just like from uploads of root is public path
export const filePath = path.join(publicPathENV, 'uploads')
export const publicPath = publicPathENV
export const certPath = path.resolve(process.env.NODE_PATH || './', 'certificates')
export const APP_BUNDLE_ID = 'net.ecmmedia.Rudicaf'
export const FIREBASE_AUTH_KEY = "AAAAnpkxC7M:APA91bGW3EbYb3BOC7dWEf-V7B1j3hpWrYNxQjWl_50UGEyXMliyppD00q_dhLkMQJP83AQaN9k2u3gPI_HMFu1vwt9jJljo9Ep0q3g8Q7_LvnI7oaqwMlgpO-9ShKqYyCyOsTCMiP4i2MS2YK74w-ut6fqvC2REEA"
export const BASE_URL = (process.env.NODE_ENV !== 'server' ? 'http://app.rudicaf.com' : 'http://thanhtu') + ':' + process.env.PORT