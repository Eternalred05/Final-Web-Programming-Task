import type { NextFunction, Request, Response } from 'express'
import { ZodError, z } from 'zod'
import { mapDbError } from '../utils/dbError'
import { HttpError } from '../utils/httpError'

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(error)
    return
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      error: error.message,
      ...(error.details !== undefined ? { detalles: error.details } : {}),
    })
    return
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Datos invalidos',
      detalles: z.flattenError(error).fieldErrors,
    })
    return
  }

  const dbError = mapDbError(error)

  if (dbError) {
    res.status(dbError.statusCode).json({
      error: dbError.message,
      ...(dbError.details !== undefined ? { detalles: dbError.details } : {}),
    })
    return
  }

  if (error instanceof SyntaxError && 'status' in error && error.status === 400) {
    res.status(400).json({ error: 'JSON invalido' })
    return
  }

  console.error('[error]', error)
  res.status(500).json({ error: 'Error interno del servidor' })
}
