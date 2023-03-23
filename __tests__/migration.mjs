
import fs from 'fs'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
dotenv.config()
const url = process.env.DB_TEST_URL
const client = new MongoClient(url)
await client.connect()
const db = client.db(process.env.DB_TEST_DATABASE)
try {
  await db.dropCollection('sellers')
  await db.dropCollection('orders')
} catch (err) {
  // drop if exists, doesn't matter
}
await db.createCollection('orders')
await db.createCollection('sellers')
await populate(db, 'sellers', 'olist_sellers_dataset.csv')
console.log('seller populated')
await populate(db, 'orders', 'olist_order_items_dataset.csv')
console.log('done with migration')
process.exit(0)

async function populate (db, tablename, filename) {
  const collection = db.collection(tablename)
  const headerLine = fs.readFileSync(filename).toString().split('\n')
  const headers = headerLine[0].split(',').map((item) => parse(item))
  const bodies = []
  for (let i = 1; i < headerLine.length; i++) {
    const document = {}
    const items = headerLine[i].split(',')
    for (let j = 0; j < items.length; j++) {
      const item = parse(items[j],
        headers[j] && headers[j].substring(headers[j].length - 2) === 'id',
        headers[j] && headers[j].substring(headers[j].length - 4) === 'date')
      document[headers[j]] = item
    }
    bodies.push(document)
  }
  console.log('populating stuff')
  await collection.insertMany(bodies)
  console.log('populated stuff')
}
function parse (item, isId, isDate) {
  let num
  if (item.charAt(0) === '"') item = item.substring(1, item.length - 1)
  if (isDate) item = new Date(item)
  else if (!isId && (num = Number(item))) item = num
  return item
}
