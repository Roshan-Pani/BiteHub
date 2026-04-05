// Request-user helpers provide a mock-compatible identity bridge for future auth.
export const extractRequestUser = (req) => {
  const headers = req?.headers || {}
  const id = String(headers['x-user-id'] || '').trim()
  const email = String(headers['x-user-email'] || '').trim().toLowerCase()
  const name = String(headers['x-user-name'] || '').trim()

  if (!id && !email && !name) return null

  return {
    id: id || null,
    email: email || null,
    name: name || null
  }
}