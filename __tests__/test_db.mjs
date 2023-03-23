import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
dotenv.config()
const url = process.env.DB_TEST_URL
export const client = new MongoClient(url)
export const db = client.db(process.env.DB_TEST_DATABASE)
