import { connection } from 'config/database'
import mysql from 'mysql2-promise'

export const db = mysql()
db.configure(connection)


