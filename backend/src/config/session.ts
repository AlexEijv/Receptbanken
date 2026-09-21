import MongoStore from 'connect-mongo'
import session from 'express-session'

import { env } from './env.js'

export function createSessionMiddleware() {
  const store = env.mongodbUri && !env.mongodbUri.includes('<cluster>')
    ? MongoStore.create({ mongoUrl: env.mongodbUri, dbName: env.mongodbDatabase, collectionName: 'sessions' })
    : undefined

  if (!store && env.nodeEnvironment !== 'test') {
    console.warn('Using in-memory sessions because MongoDB is not configured.')
  }

  return session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.nodeEnvironment === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
}