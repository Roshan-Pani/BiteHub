import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connectDatabase } from '../config/connectDatabase.js'
import { Booking, Feedback, Payment, Restaurant, User } from '../models/index.js'

const collections = [Restaurant, User, Booking, Feedback, Payment]

export const startTestDatabase = async () => {
  const mongoServer = await MongoMemoryServer.create()
  await connectDatabase(mongoServer.getUri())
  return mongoServer
}

export const resetTestDatabase = async () => {
  await Promise.all(collections.map((Model) => Model.deleteMany({})))
}

export const stopTestDatabase = async (mongoServer) => {
  await mongoose.disconnect()
  if (mongoServer) {
    await mongoServer.stop()
  }
}
