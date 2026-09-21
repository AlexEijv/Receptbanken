import 'dotenv/config'

type NodeEnvironment = 'development' | 'test' | 'production'

const nodeEnvironment = (process.env.NODE_ENV ?? 'development') as NodeEnvironment

export const env = {
  nodeEnvironment,
  port: Number(process.env.PORT ?? 8001),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI ?? '',
  mongodbDatabase: process.env.MONGODB_DATABASE ?? 'receptbanken',
  sessionSecret: process.env.SESSION_SECRET ?? 'development-only-session-secret',
  clientResetUrl: process.env.CLIENT_RESET_URL ?? 'http://localhost:5173/aterstall-losenord',
}

if (!Number.isInteger(env.port) || env.port < 1 || env.port > 65535) {
  throw new Error('PORT must be a valid TCP port.')
}

if (env.nodeEnvironment === 'production' && !env.mongodbUri) {
  throw new Error('MONGODB_URI is required in production.')
}

if (env.nodeEnvironment === 'production' && env.sessionSecret === 'development-only-session-secret') {
  throw new Error('SESSION_SECRET must be configured in production.')
}