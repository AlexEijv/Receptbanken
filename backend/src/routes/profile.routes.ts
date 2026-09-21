import { Router } from 'express'

import { requireAuth } from '../middleware/auth.js'
import { getProfile, updateProfile } from '../services/profile.service.js'
import { profileSchema } from '../validation/profile.validation.js'

export const profileRouter = Router()

profileRouter.get('/', requireAuth, async (request, response, next) => {
  try {
    response.json({ success: true, data: await getProfile(request.authenticatedUser!.id) })
  } catch (error) {
    next(error)
  }
})

profileRouter.put('/', requireAuth, async (request, response, next) => {
  try {
    const input = profileSchema.parse(request.body)
    response.json({ success: true, data: await updateProfile(request.authenticatedUser!.id, input) })
  } catch (error) {
    next(error)
  }
})