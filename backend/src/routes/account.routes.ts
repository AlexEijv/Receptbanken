import { Router } from 'express'

import { requireAuth } from '../middleware/auth.js'
import { clearAccount, deleteAccount, updateAccount } from '../services/account.service.js'
import { accountActionSchema, accountSchema } from '../validation/account.validation.js'

export const accountRouter = Router()
accountRouter.use(requireAuth)
accountRouter.put('/', async (request, response, next) => { try { response.json({ success: true, data: await updateAccount(request.authenticatedUser!.id, accountSchema.parse(request.body)) }) } catch (error) { next(error) } })
accountRouter.post('/clear', async (request, response, next) => { try { await clearAccount(request.authenticatedUser!.id, accountActionSchema.parse(request.body).currentPassword); response.json({ success: true }) } catch (error) { next(error) } })
accountRouter.delete('/', async (request, response, next) => { try { await deleteAccount(request.authenticatedUser!.id, accountActionSchema.parse(request.body).currentPassword); request.session.destroy(() => response.status(204).send()) } catch (error) { next(error) } })