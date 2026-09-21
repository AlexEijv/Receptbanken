import argon2 from 'argon2'
import { createHash, randomBytes } from 'node:crypto'
import { generateSecret, generateURI, verifySync } from 'otplib'

import { AppError } from '../middleware/error-handler.js'
import { UserModel } from '../models/user.model.js'
import { createUser, findUserByEmail } from '../repositories/user.repository.js'

export async function registerUser(input: { username: string; email: string; password: string }) {
  const email = input.email.toLowerCase()
  const existingUser = await UserModel.exists({ $or: [{ email }, { username: input.username }] })
  if (existingUser) {
    throw new AppError(409, 'E-postadressen eller användarnamnet används redan.')
  }

  const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id })
  return createUser({ username: input.username, email, passwordHash })
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email)
  const passwordMatches = user ? await argon2.verify(user.passwordHash, password) : false

  if (!user || !passwordMatches) {
    throw new AppError(401, 'E-postadress eller lösenord är fel.')
  }

  return user
}

export function verifyTwoFactorToken(secret: string, token: string) {
  return verifySync({ secret, token })
}

export async function prepareTwoFactor(userId: string, email: string) {
  const secret = generateSecret()
  await UserModel.findByIdAndUpdate(userId, { pendingTwoFactorSecret: secret }).exec()
  return { secret, uri: generateURI({ issuer: 'Receptbanken', label: email, secret }) }
}

export async function enableTwoFactor(userId: string, token: string) {
  const user = await UserModel.findById(userId).select('+twoFactorSecret +pendingTwoFactorSecret').lean().exec()
  if (!user?.pendingTwoFactorSecret || !verifyTwoFactorToken(user.pendingTwoFactorSecret, token)) throw new AppError(400, 'Ogiltig 2FA-kod.')
  await UserModel.findByIdAndUpdate(userId, { twoFactorSecret: user.pendingTwoFactorSecret, twoFactorEnabled: true, $unset: { pendingTwoFactorSecret: 1 } }).exec()
}

export async function requestPasswordReset(email: string) {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).exec()
  if (!user) return
  const token = randomBytes(32).toString('hex')
  await UserModel.findByIdAndUpdate(user._id, { resetTokenHash: createHash('sha256').update(token).digest('hex'), resetTokenExpiresAt: new Date(Date.now() + 1000 * 60 * 30) }).exec()
  if (process.env.NODE_ENV !== 'production') console.info(`Password reset token for ${user.email}: ${token}`)
}

export async function resetPassword(token: string, password: string) {
  const hash = createHash('sha256').update(token).digest('hex')
  const user = await UserModel.findOne({ resetTokenHash: hash, resetTokenExpiresAt: { $gt: new Date() } }).select('+resetTokenHash +resetTokenExpiresAt').exec()
  if (!user) throw new AppError(400, 'Återställningslänken är ogiltig eller har gått ut.')
  user.passwordHash = await argon2.hash(password, { type: argon2.argon2id })
  user.resetTokenHash = undefined
  user.resetTokenExpiresAt = undefined
  await user.save()
}

export async function disableTwoFactor(userId: string, token: string) {
  const user = await UserModel.findById(userId).select('+twoFactorSecret').lean().exec()
  if (!user?.twoFactorEnabled || !user.twoFactorSecret || !verifyTwoFactorToken(user.twoFactorSecret, token)) throw new AppError(400, 'Ogiltig 2FA-kod.')
  await UserModel.findByIdAndUpdate(userId, { twoFactorEnabled: false, $unset: { twoFactorSecret: 1 } }).exec()
}