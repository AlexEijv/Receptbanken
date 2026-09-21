import { Router } from 'express'
import { Types } from 'mongoose'

import { AppError } from '../middleware/error-handler.js'
import { RecipeModel } from '../models/recipe.model.js'
import { UserModel } from '../models/user.model.js'

export const userRouter = Router()
import { ReviewModel } from '../models/review.model.js'

userRouter.get('/:id', async (request, response, next) => {
  try {
    if (!Types.ObjectId.isValid(request.params.id)) throw new AppError(400, 'Ogiltigt användar-ID.')
    const user = await UserModel.findById(request.params.id).select('username profileImage bio createdAt lastActiveAt').lean().exec()
    if (!user) throw new AppError(404, 'Användaren kunde inte hittas.')
    const recipes = await RecipeModel.find({ authorId: user._id }).sort({ createdAt: -1 }).lean().exec()
    const reviewCount = await ReviewModel.countDocuments({ userId: user._id }).exec()
    const isOnline = Boolean(user.lastActiveAt && Date.now() - user.lastActiveAt.getTime() < 5 * 60 * 1000)
    response.json({ success: true, data: { user: { ...user, isOnline }, recipes, recipeCount: recipes.length, reviewCount } })
  } catch (error) {
    next(error)
  }
})