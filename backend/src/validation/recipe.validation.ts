import { z } from 'zod'

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Ogiltigt ID.')

const ingredient = z.object({
  amount: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(100),
})

const instruction = z.object({
  step: z.number().int().min(1),
  text: z.string().trim().min(1).max(1000),
})

export const recipeBodySchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(1).max(1000),
  image: z.string().url().max(500).optional(),
  images: z.array(z.string().url().max(500)).max(10).default([]),
  ingredients: z.array(ingredient).min(1).max(100),
  instructions: z.array(instruction).min(1).max(100),
  prepTime: z.number().int().min(0).max(1440),
  cookTime: z.number().int().min(0).max(1440),
  servings: z.number().int().min(1).max(100),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  categoryId: objectId,
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
})

export const recipeQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: objectId.optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  ingredient: z.string().trim().max(100).optional(),
  tag: z.string().trim().max(40).optional(),
  maxTime: z.coerce.number().int().min(0).max(2880).optional(),
  sort: z.enum(['newest', 'oldest', 'titleAsc', 'titleDesc', 'shortest', 'longest', 'popular', 'recommended']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
})

export const recipeIdSchema = z.object({ id: objectId })