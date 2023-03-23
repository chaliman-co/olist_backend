import client from './client.mjs'
import { db, client as dbClient } from './test_db.mjs'
const Sellers = db.collection('sellers')

afterAll(() => {
  dbClient.close()
})

describe('Seller routes work properly', () => {
  it('successfuly returns seller info', async () => {
    const sellerId = '3442f8959a84dea7ee197c632cb2df15'
    const zipCodePrefix = 13023
    const response = await client.get('/sellers', { headers: { Authorization: `Basic ${btoa(sellerId + ':' + zipCodePrefix)}` } })
    expect(response.status).toBe(200)
    const data = JSON.parse(response.data)
    expect(data).toEqual(expect.objectContaining({
      seller_id: '3442f8959a84dea7ee197c632cb2df15',
      seller_zip_code_prefix: 13023,
      seller_city: 'campinas',
      seller_state: 'SP'
    }))
  })
  it('updates seller city', async () => {
    const sellerId = 'c0f3eea2e14555b6faeea3dd58c1b1c3'
    const zipCodePrefix = 4195
    const response = await client.put('/account', JSON.stringify(
      { seller_city: 'nnewi' }),
    { headers: { 'Content-Type': 'application/json', Authorization: `Basic ${btoa(sellerId + ':' + zipCodePrefix)}` } }) // this is an otherwise valid operation on an existent seller
    expect(response.status).toBe(200)
    const data = JSON.parse(response.data)
    expect(data).toEqual({ seller_state: 'SP', seller_city: 'nnewi' })
    expect(await Sellers.findOne({ seller_id: sellerId })).toEqual(expect.objectContaining(
      {
        seller_id: 'c0f3eea2e14555b6faeea3dd58c1b1c3',
        seller_zip_code_prefix: 4195,
        seller_city: 'nnewi',
        seller_state: 'SP'
      }
    ))
  })
  it('updates seller state', async () => {
    const sellerId = 'e49c26c3edfa46d227d5121a6b6e4d37'
    const zipCodePrefix = 55325
    const response = await client.put('/account', JSON.stringify(
      { seller_state: 'anambra' }),
    { headers: { 'Content-Type': 'application/json', Authorization: `Basic ${btoa(sellerId + ':' + zipCodePrefix)}` } }) // this is an otherwise valid operation on an existent seller
    expect(response.status).toBe(200)
    const data = JSON.parse(response.data)
    expect(data).toEqual({ seller_state: 'anambra', seller_city: 'brejao' })
    expect(await Sellers.findOne({ seller_id: sellerId })).toEqual(expect.objectContaining(
      {
        seller_id: 'e49c26c3edfa46d227d5121a6b6e4d37',
        seller_zip_code_prefix: 55325,
        seller_city: 'brejao',
        seller_state: 'anambra'
      }
    ))
  })

  it('updates seller state and city together', async () => {
    const sellerId = 'e49c26c3edfa46d227d5121a6b6e4d37'
    const zipCodePrefix = 55325
    const response = await client.put('/account', JSON.stringify(
      { seller_state: 'abia', seller_city: 'aba' }),
    { headers: { 'Content-Type': 'application/json', Authorization: `Basic ${btoa(sellerId + ':' + zipCodePrefix)}` } }) // this is an otherwise valid operation on an existent seller
    expect(response.status).toBe(200)
    const data = JSON.parse(response.data)
    expect(data).toEqual({ seller_state: 'abia', seller_city: 'aba' })
    expect(await Sellers.findOne({ seller_id: sellerId })).toEqual(expect.objectContaining(
      {
        seller_id: 'e49c26c3edfa46d227d5121a6b6e4d37',
        seller_zip_code_prefix: 55325,
        seller_city: 'aba',
        seller_state: 'abia'
      }
    ))
  })
})
