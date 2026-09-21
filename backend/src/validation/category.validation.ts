import { z } from 'zod'

export const categoryBodySchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(300).optional(),
  image: z.string().url().max(500).optional(),
})

export const categoryIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Ogiltigt kategori-ID.'),
})