import { Router } from 'express'

import { requireAuth } from '../middleware/auth.js'
import { getUserDashboard } from '../services/dashboard.service.js'

export const dashboardRouter = Router()

dashboardRouter.get('/', requireAuth, async (request, response, next) => {
  try {
    const userId = request.authenticatedUser?.id
    if (!userId) {
      response.status(401).json({ success: false, message: 'Du måste vara inloggad.' })
      return
    }

    response.json({ success: true, data: await getUserDashboard(userId) })
  } catch (error) {
    next(error)
  }
})