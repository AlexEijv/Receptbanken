import { Types } from 'mongoose'

import { AppError } from '../middleware/error-handler.js'
import { RecipeModel } from '../models/recipe.model.js'
import { FavoriteModel } from '../models/favorite.model.js'
import { ReviewModel } from '../models/review.model.js'
import { ReportModel } from '../models/report.model.js'
import { recordActivity } from './activity-log.service.js'
import { createRecipe, deleteRecipe, findRecipeById, findRecipes, incrementRecipeViews, type RecipeFilters, type RecipeSort, updateRecipe } from '../repositories/recipe.repository.js'

export async function listRecipes(filters: RecipeFilters, sort: RecipeSort, page: number, limit: number) {
  const result = await findRecipes(filters, sort, page, limit)
  return {
    items: result.items,
    pagination: { page, limit, total: result.total, pages: Math.ceil(result.total / limit) },
  }
}

export async function getRecipe(recipeId: string) {
  await incrementRecipeViews(recipeId)
  const recipe = await findRecipeById(recipeId)
  if (!recipe) throw new AppError(404, 'Receptet kunde inte hittas.')
  return recipe
}

export async function createRecipeForUser(input: Record<string, unknown>, authorId: string) {
  const recipe = await createRecipe({ ...input, authorId: new Types.ObjectId(authorId) })
  await recordActivity({ userId: authorId, action: 'recipe.created', entityType: 'recipe', entityId: recipe._id.toString() })
  return recipe
}

async function getOwnedRecipe(recipeId: string, userId: string, isAdmin: boolean) {
  const recipe = await RecipeModel.findById(recipeId).select('authorId').lean().exec()
  if (!recipe) throw new AppError(404, 'Receptet kunde inte hittas.')
  if (!isAdmin && recipe.authorId.toString() !== userId) throw new AppError(403, 'Du får bara ändra dina egna recept.')
}

export async function updateRecipeForUser(recipeId: string, input: Record<string, unknown>, userId: string, isAdmin: boolean) {
  await getOwnedRecipe(recipeId, userId, isAdmin)
  const recipe = await updateRecipe(recipeId, input)
  if (!recipe) throw new AppError(404, 'Receptet kunde inte hittas.')
  await recordActivity({ userId, action: 'recipe.updated', entityType: 'recipe', entityId: recipeId })
  return recipe
}

export async function deleteRecipeForUser(recipeId: string, userId: string, isAdmin: boolean) {
  await getOwnedRecipe(recipeId, userId, isAdmin)
  await Promise.all([
    deleteRecipe(recipeId),
    FavoriteModel.deleteMany({ recipeId }).exec(),
    ReviewModel.deleteMany({ recipeId }).exec(),
    ReportModel.deleteMany({ recipeId }).exec(),
  ])
  await recordActivity({ userId, action: 'recipe.deleted', entityType: 'recipe', entityId: recipeId })
}