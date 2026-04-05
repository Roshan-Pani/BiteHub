// Validation middleware keeps transport-level payload checks at route boundaries.
export const requireBodyFields = (fields = []) => {
  return (req, res, next) => {
    const payload = req.body || {}
    const missing = fields.filter((field) => {
      const value = payload[field]
      return value === undefined || value === null || value === ''
    })

    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing required field(s): ${missing.join(', ')}`
      })
    }

    return next()
  }
}