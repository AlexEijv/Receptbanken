import { z } from 'zod'

export const profileSchema = z.object({
  username: z.string().trim().min(3).max(40),
  bio: z.string().trim().max(500).optional(),
  profileImage: z.string().url().max(500).optional().or(z.literal('')),
})