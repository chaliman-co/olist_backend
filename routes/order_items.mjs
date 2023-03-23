import { Router } from 'express'
import { query as validator, validationResult } from 'express-validator'
import db from '../lib/db.mjs'

const router = Router()
router.get('/', validator('limit').isInt().optional().custom((value, { req }) => {
  if (value < 20 || value > 100) {
    throw new Error('out of range')
  }
  return true
}), validator('offset').isInt().optional().custom((value, { req }) => {
  if (value < 0) throw new Error('out of range')
  return true
}), validator('sort_by').optional().isIn(['shipping_limit_date', 'price']),
getOrderItems)
router.delete('/:id', deleteOrderItems)
export default router

async function getOrderItems (req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { sort_by: sortBy = 'shipping_limit_date', offset = 0, limit = 20 } = req.query
  const total = await db.collection('orders').countDocuments({ seller_id: req.user.seller_id })
  const documents = await db.collection('orders').find({ seller_id: req.user.seller_id })
    .skip(Number(offset))
    .limit(Number(limit))
    .sort({ [sortBy]: 1 })
    .toArray()
  res.json({ data: documents, total, limit, offset })
}
async function deleteOrderItems (req, res, next) {
  await db.collection('orders').deleteOne({ order_id: req.params.id })
  res.json({ status: 'success' })
}
