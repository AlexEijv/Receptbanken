import { z } from 'zod'

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(40),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
})

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
  twoFactorToken: z.string().regex(/^\d{6}$/).optional(),
})

export const twoFactorTokenSchema = z.object({ token: z.string().regex(/^\d{6}$/) })
export const resetRequestSchema = z.object({ email: z.string().trim().email().max(254) })
export const resetPasswordSchema = z.object({ token: z.string().min(32).max(256), password: z.string().min(12).max(128) })