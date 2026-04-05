import test from 'node:test'
import assert from 'node:assert/strict'
import { once } from 'node:events'
import { app } from '../app.js'

let server
let baseUrl

const request = async (path, options = {}) => {
  const response = await fetch(`${baseUrl}${path}`, options)
  let body = null

  try {
    body = await response.json()
  } catch {
    body = null
  }

  return { response, body }
}

test.before(async () => {
  server = app.listen(0)
  await once(server, 'listening')
  const address = server.address()
  baseUrl = `http://127.0.0.1:${address.port}`
})

test.after(async () => {
  if (!server) return
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error)
      else resolve()
    })
  })
})

test('GET / returns API metadata', async () => {
  const { response, body } = await request('/')

  assert.equal(response.status, 200)
  assert.equal(body?.name, 'BITEHUB Backend API')
  assert.equal(body?.docs, '/api/health')
})

test('POST /api/users/resolve rejects payload without email', async () => {
  const { response, body } = await request('/api/users/resolve', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({})
  })

  assert.equal(response.status, 400)
  assert.match(String(body?.message), /missing required field\(s\): email/i)
})

test('POST /api/bookings rejects payload without id', async () => {
  const { response, body } = await request('/api/bookings', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({})
  })

  assert.equal(response.status, 400)
  assert.match(String(body?.message), /missing required field\(s\): id/i)
})

test('POST /api/feedback/submit rejects payload missing required fields', async () => {
  const { response, body } = await request('/api/feedback/submit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userId: 'U1' })
  })

  assert.equal(response.status, 400)
  assert.match(String(body?.message), /missing required field\(s\): bookingId, restaurantId, rating/i)
})

test('POST /api/payments rejects payload without id', async () => {
  const { response, body } = await request('/api/payments', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({})
  })

  assert.equal(response.status, 400)
  assert.match(String(body?.message), /missing required field\(s\): id/i)
})
