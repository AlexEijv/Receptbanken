import { AppError } from '../middleware/error-handler.js'
import { FavoriteModel } from '../models/favorite.model.js'
import { RecipeModel } from '../models/recipe.model.js'
import { ReviewModel } from '../models/review.model.js'
import { createFavorite, deleteFavorite, findFavoritesByUser } from '../repositories/favorite.repository.js'

export function getUserFavorites(userId: string) {
  return findFavoritesByUser(userId).then(async (favorites) => {
    const recipeIds = favorites.map((favorite) => favorite.recipeId?._id).filter(Boolean)
    const stats = await ReviewModel.aggregate<{ _id: unknown; reviewCount: number; averageRating: number }>([
      { $match: { recipeId: { $in: recipeIds } } },
      { $group: { _id: '$recipeId', reviewCount: { $sum: 1 }, averageRating: { $avg: '$rating' } } },
    ]).exec()
    const statMap = new Map(stats.map((stat) => [String(stat._id), stat]))
    return favorites.map((favorite) => {
      const recipe = favorite.recipeId as typeof favorite.recipeId & { reviewCount?: number; averageRating?: number }
      const stat = statMap.get(String(recipe?._id))
      return { ...favorite, recipeId: { ...recipe, reviewCount: stat?.reviewCount ?? 0, averageRating: stat?.averageRating ?? 0 } }
    })
  })
}

export async function addFavorite(userId: string, recipeId: string) {
  const recipeExists = await RecipeModel.exists({ _id: recipeId })
  if (!recipeExists) throw new AppError(404, 'Receptet kunde inte hittas.')

  try {
    return await createFavorite(userId, recipeId)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      throw new AppError(409, 'Receptet finns redan bland dina favoriter.')
    }
    throw error
  }
}

export async function removeFavorite(userId: string, recipeId: string) {
  const result = await deleteFavorite(userId, recipeId)
  if (result.deletedCount === 0) throw new AppError(404, 'Favoriten kunde inte hittas.')
}

export function favoriteModelForTests() {
  return FavoriteModel
}