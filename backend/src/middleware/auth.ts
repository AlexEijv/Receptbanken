import type { RequestHandler } from 'express'

import { AppError } from './error-handler.js'
import { UserModel, type UserRole } from '../models/user.model.js'

declare module 'express-session' {
  interface SessionData {
    userId?: string
    pendingUserId?: string
  }
}

export const requireAuth: RequestHandler = async (request, _response, next) => {
  try {
    if (!request.session.userId) {
      throw new AppError(401, 'Du måste vara inloggad.')
    }

    const user = await UserModel.findById(request.session.userId).select('username email role profileImage').lean().exec()
    if (!user) {
      request.session.destroy(() => undefined)
      throw new AppError(401, 'Din session är inte längre giltig.')
    }

    request.authenticatedUser = {
      id: user._id.toString(),
      role: user.role,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    }
    await UserModel.findByIdAndUpdate(user._id, { lastActiveAt: new Date() }).exec()
    next()
  } catch (error) {
    next(error)
  }
}

export function requireRole(role: UserRole): RequestHandler {
  return (request, _response, next) => {
    if (request.authenticatedUser?.role !== role) {
      next(new AppError(403, 'Du saknar behörighet för den här funktionen.'))
      return
    }

    next()
  }
}
