import { Router } from 'express'

import { isDatabaseConnected } from '../config/database.js'

export const healthRouter = Router()

healthRouter.get('/', (_request, response) => {
  response.json({
    success: true,
    data: {
      status: 'ok',
      database: isDatabaseConnected() ? 'connected' : 'not-configured',
    },
  })
})