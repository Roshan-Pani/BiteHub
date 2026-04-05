// Service-result helper keeps controller response mapping consistent.
export const sendServiceResult = (res, result) => {
  if (!result?.ok) {
    return res.status(result?.status || 400).json({ message: result?.message || 'Request failed' })
  }

  return res.status(result.status || 200).json(result.data)
}