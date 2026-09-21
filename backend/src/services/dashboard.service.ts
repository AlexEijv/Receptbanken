import { FavoriteModel } from '../models/favorite.model.js'
import { RecipeModel } from '../models/recipe.model.js'
import { UserModel } from '../models/user.model.js'

export async function getUserDashboard(userId: string) {
  const [user, recipeCount, favoriteCount, recentRecipes, recentFavorites] = await Promise.all([
    UserModel.findById(userId).select('username email profileImage bio role createdAt').lean().exec(),
    RecipeModel.countDocuments({ authorId: userId }).exec(),
    FavoriteModel.countDocuments({ userId }).exec(),
    RecipeModel.find({ authorId: userId }).sort({ createdAt: -1 }).limit(5).lean().exec(),
    FavoriteModel.find({ userId }).sort({ createdAt: -1 }).limit(5).populate({ path: 'recipeId', populate: { path: 'categoryId', select: 'name' } }).lean().exec().then((favorites) => favorites.filter((favorite) => favorite.recipeId)),
  ])

  return { user, stats: { recipeCount, favoriteCount }, recentRecipes, recentFavorites }
}