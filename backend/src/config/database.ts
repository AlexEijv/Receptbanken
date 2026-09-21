import mongoose from 'mongoose'

import { env } from './env.js'

export async function connectDatabase(): Promise<void> {
  if (!env.mongodbUri || env.mongodbUri.includes('<cluster>')) {
    console.warn('MONGODB_URI is not configured; starting without a database connection.')
    return
  }

  try {
    await mongoose.connect(env.mongodbUri, { dbName: env.mongodbDatabase, serverSelectionTimeoutMS: 5000 })
  } catch (error) {
    if (env.nodeEnvironment === 'production') {
      throw error
    }

    console.warn('MongoDB kunde inte nås; API:t startar utan databasanslutning.')
    console.warn(error instanceof Error ? error.message : error)
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect()
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1
}