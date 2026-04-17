const DEFAULT_BASE = 'http://localhost:8080/api'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE

export const fetchJson = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}
