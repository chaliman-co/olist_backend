import client from './client.mjs'

describe('Making requests without authentication fails', () => {
  it('fails when auth parameters are not included when getting seller info', async () => {
    const response = await client.get('/sellers')
    expect(response.status).toBe(401)
    const data = JSON.parse(response.data)
    expect(data.status).toBe('failed')
    expect(data.reason).toBe('authentication failed')
  })
  it('fails when auth parameters are not included when getting orders', async () => {
    const response = await client.get('/order_items')
    expect(response.status).toBe(401)
    const data = JSON.parse(response.data)
    expect(data.status).toBe('failed')
    expect(data.reason).toBe('authentication failed')
  })
  it('fails when auth parameters are not included when updating seller', async () => {
    const response = await client.put('/sellers/3442f8959a84dea7ee197c632cb2df15', JSON.stringify(
      { seller_city: 'nnewi' }),
    { headers: { 'Content-Type': 'application/json' } }) // this is an otherwise valid operation on an existent seller
    expect(response.status).toBe(401)
    const data = JSON.parse(response.data)
    expect(data.status).toBe('failed')
    expect(data.reason).toBe('authentication failed')
  })
  it('fails when wrong username and password are provided', async () => {
    const response = await client.get('/sellers', { headers: { Authorization: `Basic ${btoa('wronguser:wrongpass')}` } })
    expect(response.status).toBe(401)
    const data = JSON.parse(response.data)
    expect(data.status).toBe('failed')
    expect(data.reason).toBe('authentication failed')
  })
})
