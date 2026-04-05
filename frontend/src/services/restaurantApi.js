import { fetchJson } from './apiClient'

export const getRestaurants = () => fetchJson('/restaurants')

export const getRestaurantById = (id) => fetchJson(`/restaurants/${id}`)

export const getRestaurantMenu = (id) => fetchJson(`/restaurants/${id}/menu`)

export const getSeatsForSlotFromApi = ({ restaurantId, date, time }) => {
  const params = new URLSearchParams({ date, time })
  return fetchJson(`/restaurants/${restaurantId}/seats?${params.toString()}`)
}
