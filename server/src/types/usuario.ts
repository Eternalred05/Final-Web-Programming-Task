export interface Usuario {
  idUsuario: number
  nombre: string
  usuario: string
  contrasena: string
  admin: boolean
}

export type UsuarioPublico = Omit<Usuario, 'contrasena'>
