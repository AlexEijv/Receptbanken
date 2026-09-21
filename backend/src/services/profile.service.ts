import { AppError } from '../middleware/error-handler.js'
import { UserModel } from '../models/user.model.js'

export async function getProfile(userId: string) {
  const user = await UserModel.findById(userId).select('username email profileImage bio role twoFactorEnabled createdAt').lean().exec()
  if (!user) throw new AppError(404, 'Profilen kunde inte hittas.')
  return user
}

export async function updateProfile(userId: string, input: { username: string; bio?: string; profileImage?: string }) {
  const duplicate = await UserModel.exists({ username: input.username, _id: { $ne: userId } })
  if (duplicate) throw new AppError(409, 'Användarnamnet används redan.')

  const user = await UserModel.findByIdAndUpdate(userId, input, { returnDocument: 'after', runValidators: true })
    .select('username email profileImage bio role twoFactorEnabled createdAt')
    .lean()
    .exec()
  if (!user) throw new AppError(404, 'Profilen kunde inte hittas.')
  return user
}