import { Router } from 'express'

import { requireAuth, requireRole } from '../middleware/auth.js'
import { AppError } from '../middleware/error-handler.js'
import { deleteAdminRecipe, deleteAdminUser, getAdminDashboard, listAdminRecipes, listAdminUsers } from '../services/admin.service.js'

export const adminRouter = Router()
adminRouter.use(requireAuth, requireRole('admin'))

adminRouter.get('/dashboard', async (_request, response, next) => {
  try { response.json({ success: true, data: await getAdminDashboard() }) } catch (error) { next(error) }
})

adminRouter.get('/users', async (_request, response, next) => {
  try { response.json({ success: true, data: await listAdminUsers() }) } catch (error) { next(error) }
})

adminRouter.get('/recipes', async (_request, response, next) => {
  try { response.json({ success: true, data: await listAdminRecipes() }) } catch (error) { next(error) }
})

adminRouter.delete('/users/:id', async (request, response, next) => {
  try {
    if (request.params.id === request.authenticatedUser?.id) throw new AppError(400, 'Du kan inte ta bort ditt eget adminkonto.')
    await deleteAdminUser(request.params.id)
    response.status(204).send()
  } catch (error) { next(error) }
})

adminRouter.delete('/recipes/:id', async (request, response, next) => {
  try { await deleteAdminRecipe(request.params.id); response.status(204).send() } catch (error) { next(error) }
})