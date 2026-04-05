import { Restaurant } from '../models/index.js'

// Restaurant repository centralizes all Mongo access for restaurant records.
export const listRestaurants = () => Restaurant.find().lean()

export const findRestaurantById = (id) => Restaurant.findOne({ id }).lean()

export const countRestaurants = () => Restaurant.estimatedDocumentCount()