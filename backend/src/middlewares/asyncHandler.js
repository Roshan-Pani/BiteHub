// Async handler removes repetitive try/catch wrappers in routes.
export const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}