import { User } from '../models/index.js'

// User repository centralizes Mongo access for identity and profile records.
export const listUsers = () => User.find().lean()

export const countUsers = () => User.estimatedDocumentCount()

export const findUserByEmail = (email) => User.findOne({ email }).lean()

export const upsertUserById = (user) => User.findOneAndUpdate(
  { id: user.id },
  { $set: user },
  { upsert: true, new: true, runValidators: true, context: 'query' }
).lean()