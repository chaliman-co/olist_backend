import { Router } from 'express'
import { body as validator } from 'express-validator'
import db from '../lib/db.mjs'

const router = Router()
router.get('/', getSeller)
router.put('/', validator('').isInt().custom((value, { req }) => {
  if (value < 20 || value > 100) {
    throw new Error('out of range')
  }
  return true
}), validator('seller_state').custom((value, { req }) => {
  if (!value.length) throw new Error('state cannot be empty')
  return true
}), validator('seller_city').custom((value, { req }) => {
  if (!value.length) throw new Error('state cannot be empty')
  return true
}), updateSeller)
export default router

async function updateSeller (req, res, next) {
  const city = req.body.seller_city || req.user.seller_city
  const state = req.body.seller_state || req.user.seller_state
  await db.collection('sellers').updateOne({ seller_id: req.user.seller_id }, { $set: { seller_city: city, seller_state: state } })
  res.json({ seller_city: city, seller_state: state })
}
function getSeller (req, res, next) {
  res.json(req.user)
}
