import { app } from './app.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'
import { env } from './config/env.js'

async function startServer(): Promise<void> {
  await connectDatabase()

  const server = app.listen(env.port, () => {
    console.log(`Receptbanken API kör på http://localhost:${env.port}`)
  })

  const shutdown = async (): Promise<void> => {
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
  }

  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
}

startServer().catch((error: unknown) => {
  console.error('Kunde inte starta API-servern.', error)
  process.exit(1)
})