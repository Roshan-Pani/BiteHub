import express from 'express'
import cors from 'cors'
import { apiRouter } from './routes/api.js'
import { env } from './config/env.js'

export const app = express()

app.use(cors({ origin: env.frontendUrl }))
app.use(express.json({ limit: '1mb' }))

app.get('/', (_req, res) => {
  res.json({
    name: 'BITEHUB Backend API',
    version: '1.0.0',
    docs: '/api/health'
  })
})

app.use('/api', apiRouter)
