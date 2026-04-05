import { app } from './app.js'
import { env } from './config/env.js'
import { connectDatabase } from './config/connectDatabase.js'
import { seedDatabase } from './data/seedDatabase.js'

const startServer = async () => {
  try {
    await connectDatabase(env.mongoUri)
    await seedDatabase()

    app.listen(env.port, () => {
      console.log(`Backend running on http://localhost:${env.port}`)
    })
  } catch (error) {
    console.error('Failed to start backend', error)
    process.exit(1)
  }
}

startServer()
