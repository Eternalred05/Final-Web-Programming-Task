import jwt, { type SignOptions } from 'jsonwebtoken'
import { query } from '../config/db'
import { env } from '../config/env'
import type { UsuarioPublico } from '../types/usuario'

interface UsuarioRow {
  idusuario: number
  nombre: string
  usuario: string
  contrasena: string
  admin: boolean
}

export interface LoginResult {
  token: string
  usuario: UsuarioPublico
}

export async function login(
  usuario: string,
  contrasena: string,
): Promise<LoginResult | null> {
  const { rows } = await query<UsuarioRow>(
    `SELECT idusuario, nombre, usuario, contrasena, admin
     FROM usuario
     WHERE usuario = $1 AND contrasena = $2`,
    [usuario, contrasena],
  )

  const row = rows[0]

  if (!row) {
    return null
  }

  const token = jwt.sign(
    {
      sub: String(row.idusuario),
      usuario: row.usuario,
      nombre: row.nombre,
      admin: row.admin,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] },
  )

  return {
    token,
    usuario: {
      idUsuario: row.idusuario,
      nombre: row.nombre,
      usuario: row.usuario,
      admin: row.admin,
    },
  }
}
