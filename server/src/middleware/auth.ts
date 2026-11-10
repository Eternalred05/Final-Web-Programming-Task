import type { NextFunction, Request, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { env } from '../config/env'

export interface AuthPayload extends JwtPayload {
  sub: string
  usuario: string
  nombre: string
  admin: boolean
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' })
    return
  }

  const token = header.slice('Bearer '.length)

  try {
    req.user = jwt.verify(token, env.jwtSecret) as AuthPayload
    next()
  } catch {
    res.status(401).json({ error: 'Token invalido o expirado' })
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user?.admin) {
    res.status(403).json({ error: 'Se requiere rol de administrador' })
    return
  }

  next()
}
