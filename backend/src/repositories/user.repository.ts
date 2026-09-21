import { UserModel } from '../models/user.model.js'

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email: email.toLowerCase() }).select('+passwordHash +twoFactorSecret').exec()
}

export function findPublicUserById(userId: string) {
  return UserModel.findById(userId).select('username profileImage bio role createdAt').lean().exec()
}

export function createUser(input: { username: string; email: string; passwordHash: string }) {
  return UserModel.create({ ...input, email: input.email.toLowerCase() })
}