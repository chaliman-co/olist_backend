import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
dotenv.config()
const url = process.env.DB_URL
const client = new MongoClient(url)
await client.connect(); console.log(process.env.DB_DATABASE)
export default client.db(process.env.DB_DATABASE)
