// Global error middleware standardizes unexpected error responses.
export const errorHandler = (error, _req, res, _next) => {
  const status = Number(error?.status) || 500
  const message = status >= 500
    ? 'Internal server error'
    : (error?.message || 'Request failed')

  if (status >= 500) {
    console.error('Unhandled backend error:', error)
  }

  return res.status(status).json({ message })
}