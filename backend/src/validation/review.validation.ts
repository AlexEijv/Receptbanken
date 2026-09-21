import { z } from 'zod'

export const reviewSchema = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().trim().min(2).max(1000) })
export const reviewIdSchema = z.object({ recipeId: z.string().regex(/^[a-f\d]{24}$/i, 'Ogiltigt recept-ID.') })