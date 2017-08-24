import { connection } from 'config/database'
import mysql from 'mysql2-promise'

const db = mysql()
db.configure(connection)
db.pool.on('connection', (poolConnection) => {
    poolConnection.config.namedPlaceholders = true
})

export default db

