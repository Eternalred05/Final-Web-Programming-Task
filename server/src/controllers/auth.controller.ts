import type { Request, Response } from 'express'
import { z } from 'zod'
import { login } from '../services/auth.service'

const loginSchema = z.object({
  usuario: z.string().trim().min(1, 'El usuario es obligatorio'),
  contrasena: z.string().min(1, 'La contrasena es obligatoria'),
})

export async function loginController(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({
      error: 'Datos invalidos',
      detalles: parsed.error.flatten().fieldErrors,
    })
    return
  }

  const result = await login(parsed.data.usuario, parsed.data.contrasena)

  if (!result) {
    res.status(401).json({ error: 'Usuario o contrasena incorrectos' })
    return
  }

  res.json(result)
}
