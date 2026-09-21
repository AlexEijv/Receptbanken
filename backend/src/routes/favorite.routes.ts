import { Router } from 'express'

import { requireAuth } from '../middleware/auth.js'
import { AppError } from '../middleware/error-handler.js'
import { addFavorite, getUserFavorites, removeFavorite } from '../services/favorite.service.js'

export const favoriteRouter = Router()

function canManageFavorites(requestUserId: string | undefined, requestedUserId: string) {
  return requestUserId === requestedUserId
}

function getRouteParam(value: string | string[] | undefined): string {
  if (typeof value !== 'string') throw new AppError(400, 'Ogiltig route-parameter.')
  return value
}

favoriteRouter.get('/users/:id/favorites', requireAuth, async (request, response, next) => {
  try {
    const userId = getRouteParam(request.params.id)
    if (!canManageFavorites(request.authenticatedUser?.id, userId)) throw new AppError(403, 'Du saknar behörighet.')
    response.json({ success: true, data: await getUserFavorites(userId) })
  } catch (error) {
    next(error)
  }
})

favoriteRouter.post('/users/:id/favorites/:recipeId', requireAuth, async (request, response, next) => {
  try {
    const userId = getRouteParam(request.params.id)
    const recipeId = getRouteParam(request.params.recipeId)
    if (!canManageFavorites(request.authenticatedUser?.id, userId)) throw new AppError(403, 'Du saknar behörighet.')
    response.status(201).json({ success: true, data: await addFavorite(userId, recipeId) })
  } catch (error) {
    next(error)
  }
})

favoriteRouter.delete('/users/:id/favorites/:recipeId', requireAuth, async (request, response, next) => {
  try {
    const userId = getRouteParam(request.params.id)
    const recipeId = getRouteParam(request.params.recipeId)
    if (!canManageFavorites(request.authenticatedUser?.id, userId)) throw new AppError(403, 'Du saknar behörighet.')
    await removeFavorite(userId, recipeId)
    response.status(204).send()
  } catch (error) {
    next(error)
  }
})