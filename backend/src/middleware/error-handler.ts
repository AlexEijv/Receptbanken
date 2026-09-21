import type { ErrorRequestHandler, RequestHandler } from 'express'

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const notFoundHandler: RequestHandler = (_request, _response, next) => {
  next(new AppError(404, 'Resursen kunde inte hittas.'))
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500
  const message = error instanceof AppError ? error.message : 'Något gick fel på servern.'

  if (statusCode === 500) {
    console.error(error)
  }

  response.status(statusCode).json({
    success: false,
    message,
  })
}