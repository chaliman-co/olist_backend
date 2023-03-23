import auth from 'basic-auth'
import db from '../db.mjs'
export default async function (req, res, next) {
  const credentials = auth(req)
  const user = credentials && await getUser(credentials.name, credentials.pass)
  if (!user) {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="all"')
    res.json({
      status: 'failed',
      reason: 'authentication failed',
      errors: { auth: 'missing' }
    })
  } else {
    req.user = user
    next()
  }
}
async function getUser (name, password) {
  const user = (await db.collection('sellers').findOne({ seller_id: name, seller_zip_code_prefix: Number(password) }))
  return user
}
