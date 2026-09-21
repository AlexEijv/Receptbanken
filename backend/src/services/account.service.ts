import argon2 from 'argon2'

import { AppError } from '../middleware/error-handler.js'
import { FavoriteModel } from '../models/favorite.model.js'
import { RecipeModel } from '../models/recipe.model.js'
import { ReviewModel } from '../models/review.model.js'
import { UserModel } from '../models/user.model.js'

export async function updateAccount(userId: string, input: { username: string; email: string; currentPassword: string; newPassword?: string }) {
  const user = await UserModel.findById(userId).select('+passwordHash').exec()
  if (!user || !await argon2.verify(user.passwordHash, input.currentPassword)) throw new AppError(400, 'Nuvarande lösenord är fel.')
  const duplicate = await UserModel.exists({ $or: [{ username: input.username }, { email: input.email.toLowerCase() }], _id: { $ne: userId } })
  if (duplicate) throw new AppError(409, 'Användarnamn eller e-post används redan.')
  user.username = input.username
  user.email = input.email.toLowerCase()
  if (input.newPassword) user.passwordHash = await argon2.hash(input.newPassword, { type: argon2.argon2id })
  await user.save()
  return { id: user._id, username: user.username, email: user.email, role: user.role }
}

export async function clearAccount(userId: string, password: string) {
  const user = await UserModel.findById(userId).select('+passwordHash').exec()
  if (!user || !await argon2.verify(user.passwordHash, password)) throw new AppError(400, 'Lösenordet är fel.')
  await Promise.all([FavoriteModel.deleteMany({ userId }), ReviewModel.deleteMany({ userId }), RecipeModel.deleteMany({ authorId: userId })])
  await UserModel.findByIdAndUpdate(userId, { bio: '', profileImage: '', username: `user-${user._id.toString().slice(-6)}` }).exec()
}

export async function deleteAccount(userId: string, password: string) {
  const user = await UserModel.findById(userId).select('+passwordHash').exec()
  if (!user || !await argon2.verify(user.passwordHash, password)) throw new AppError(400, 'Lösenordet är fel.')
  await Promise.all([FavoriteModel.deleteMany({ userId }), ReviewModel.deleteMany({ userId }), RecipeModel.deleteMany({ authorId: userId }), UserModel.findByIdAndDelete(userId)])
}