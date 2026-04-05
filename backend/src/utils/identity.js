// Identity utilities keep repeated email normalization and deterministic ID logic out of services.
export const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

export const createHashId = (prefix, value) => {
  let hash = 0
  const source = String(value || '')

  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash) + source.charCodeAt(index)
    hash |= 0
  }

  return `${prefix}${Math.abs(hash)}`
}