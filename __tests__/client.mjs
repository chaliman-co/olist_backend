import { Axios } from 'axios'
const client = new Axios()
client.defaults = { baseURL: 'http://localhost:8000' }
export default client
