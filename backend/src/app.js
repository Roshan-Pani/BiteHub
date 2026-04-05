import express from 'express'
import cors from 'cors'
import { apiRouter } from './routes/api.js'
import { env } from './config/env.js'
import { attachRequestUser } from './middlewares/attachRequestUser.js'
import { errorHandler } from './middlewares/errorHandler.js'

export const app = express()

app.use(cors({ origin: env.frontendUrl }))
app.use(express.json({ limit: '1mb' }))
app.use(attachRequestUser)

app.get('/', (_req, res) => {
  res.json({
    name: 'BITEHUB Backend API',
    version: '1.0.0',
    docs: '/api/health'
  })
})

app.use('/api', apiRouter)

// Error middleware stays last to catch async/controller failures.
app.use(errorHandler)
