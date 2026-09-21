import { z } from 'zod'

export const accountSchema = z.object({ username: z.string().trim().min(3).max(40), email: z.string().trim().email().max(254), currentPassword: z.string().min(1), newPassword: z.string().min(12).max(128).optional() })
export const accountActionSchema = z.object({ currentPassword: z.string().min(1) })