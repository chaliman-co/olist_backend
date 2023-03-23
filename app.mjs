import createError from 'http-errors'
import express from 'express'
import logger from 'morgan'
import sellerRouter from './routes/sellers.mjs'
import authGuard from './lib/guards/auth_guard.mjs'
import orderRouter from './routes/order_items.mjs'
import cors from 'cors'

const app = express()

app.use(logger('dev'))
app.use(cors())
app.use(authGuard)
app.use(express.json())

app.use('/sellers', sellerRouter)
app.use('/account', sellerRouter) // it's really about the same entity
app.use('/order_items', orderRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// module.exports = app;
export default app
