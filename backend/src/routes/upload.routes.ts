import { randomUUID } from 'node:crypto'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

import { Router } from 'express'
import multer from 'multer'

import { env } from '../config/env.js'
import { requireAuth } from '../middleware/auth.js'
import { AppError } from '../middleware/error-handler.js'

const uploadDirectory = path.resolve(process.cwd(), 'public', 'uploads')
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const storage = multer.diskStorage({
  destination: async (_request, _file, callback) => { await mkdir(uploadDirectory, { recursive: true }); callback(null, uploadDirectory) },
  filename: (_request, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (_request, file, callback) => callback(null, allowedMimeTypes.has(file.mimetype)),
})

export const uploadRouter = Router()

uploadRouter.post('/images', requireAuth, upload.array('images', 10), (request, response, next) => {
  try {
    const files = request.files as Express.Multer.File[] | undefined
    if (!files?.length) throw new AppError(400, 'Välj minst en JPG-, PNG- eller WebP-bild.')
    const baseUrl = `${request.protocol}://${request.get('host')}`
    response.status(201).json({ success: true, data: { urls: files.map((file) => `${baseUrl}/uploads/${file.filename}`) } })
  } catch (error) { next(error) }
})

export { uploadDirectory, env }