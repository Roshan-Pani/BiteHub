import { env } from '../config/env.js'
import { connectDatabase } from '../config/connectDatabase.js'
import { seedDatabase } from '../data/seedDatabase.js'

const run = async () => {
  try {
    await connectDatabase(env.mongoUri)
    const result = await seedDatabase()
    console.log('Seed result:', result)
    process.exit(0)
  } catch (error) {
    console.error('Seed failed', error)
    process.exit(1)
  }
}

run()
