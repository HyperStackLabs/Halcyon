import 'dotenv/config'
import { connectDB } from './database/db.js'
import createServer from './server/server.js'

connectDB()
createServer().listen(4000, '0.0.0.0', () => {
    console.log('Listening to port 4000')
})