import { FavoriteModel } from '../models/favorite.model.js'

export function findFavoritesByUser(userId: string) {
  return FavoriteModel.find({ userId }).sort({ createdAt: -1 }).populate('recipeId').lean().exec()
}

export function createFavorite(userId: string, recipeId: string) {
  return FavoriteModel.create({ userId, recipeId })
}

export function deleteFavorite(userId: string, recipeId: string) {
  return FavoriteModel.deleteOne({ userId, recipeId }).exec()
}