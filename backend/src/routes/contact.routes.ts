import { Router } from 'express'
import { z } from 'zod'

const contactSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().email().max(254), message: z.string().trim().min(10).max(3000) })
export const contactRouter = Router()

contactRouter.post('/', (request, response, next) => {
  try {
    const message = contactSchema.parse(request.body)
    console.info(`Kontaktmeddelande från ${message.email}: ${message.message}`)
    response.status(201).json({ success: true, message: 'Meddelandet har skickats.' })
  } catch (error) { next(error) }
})