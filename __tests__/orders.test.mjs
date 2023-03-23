import client from './client.mjs'
import { db, client as dbClient } from './test_db.mjs'
const DEFAULT_PAGE_SIZE = 20
const DEFAULT_SORT_FIELD = 'shipping_limit_date'
const Orders = db.collection('orders')

afterAll(async () => {
  dbClient.close(true)
})
describe('Order routes work properly', () => {
  it('successfuly returns sellers orders (default page)', async () => {
    const sellerId = 'd1b65fc7debc3361ea86b5f14c68d2e2'
    const zipCodePrefix = 13844
    const response = await client.get('/order_items', { headers: { Authorization: `Basic ${btoa(sellerId + ':' + zipCodePrefix)}` } })
    expect(response.status).toBe(200)
    const data = JSON.parse(response.data).data
    expect(data).toEqual((await Orders.find({ seller_id: sellerId })
      .skip(0)
      .limit(DEFAULT_PAGE_SIZE)
      .sort({ [DEFAULT_SORT_FIELD]: 1 })
      .toArray()).map(item => {
      item.shipping_limit_date = item.shipping_limit_date.toISOString()
      item._id = item._id.toString()
      return item
    }))
  })
  it('successfuly returns sellers orders (specific page)', async () => {
    const sellerId = 'd1b65fc7debc3361ea86b5f14c68d2e2'
    const zipCodePrefix = 13844
    const response = await client.get(`/order_items?offset=20&limit=${DEFAULT_PAGE_SIZE}`, { headers: { Authorization: `Basic ${btoa(sellerId + ':' + zipCodePrefix)}` } })
    expect(response.status).toBe(200)
    const data = JSON.parse(response.data).data
    expect(data).toEqual((await Orders.find({ seller_id: sellerId })
      .skip(20)
      .limit(DEFAULT_PAGE_SIZE)
      .sort({ [DEFAULT_SORT_FIELD]: 1 })
      .toArray()).map(item => {
      item.shipping_limit_date = item.shipping_limit_date.toISOString()
      item._id = item._id.toString()
      return item
    }))
  })
  it('successfuly sorts sellers orders (specific page) by price', async () => {
    const sellerId = 'd1b65fc7debc3361ea86b5f14c68d2e2'
    const zipCodePrefix = 13844
    const response = await client.get(`/order_items?offset=20&limit=${DEFAULT_PAGE_SIZE}&sort_by=price`, { headers: { Authorization: `Basic ${btoa(sellerId + ':' + zipCodePrefix)}` } })
    expect(response.status).toBe(200)
    const data = JSON.parse(response.data).data
    expect(data).toEqual((await Orders.find({ seller_id: sellerId })
      .skip(20)
      .limit(DEFAULT_PAGE_SIZE)
      .sort({ price: 1 })
      .toArray()).map(item => {
      item.shipping_limit_date = item.shipping_limit_date.toISOString()
      item._id = item._id.toString()
      return item
    }))
  })
  it('successfully deletes an order', async () => {
    const sellerId = 'c0f3eea2e14555b6faeea3dd58c1b1c3'
    const orderId = '4e7838e2ac3b81d9d9ca377dcc0549de'
    const zipCodePrefix = 4195
    const response = await client.delete(`/order_items/${orderId}`,
      { headers: { 'Content-Type': 'application/json', Authorization: `Basic ${btoa(sellerId + ':' + zipCodePrefix)}` } }) // this is an otherwise valid operation on an existent seller
    expect(response.status).toBe(200)
    expect(await Orders.findOne({ order_id: orderId })).toEqual(null)
  })
})
