import { DatabaseError } from 'pg'
import { HttpError } from './httpError'

export function mapDbError(error: unknown): HttpError | null {
  if (!(error instanceof DatabaseError)) {
    return null
  }

  switch (error.code) {
    case '23505':
      return new HttpError(409, 'Ya existe un registro con ese valor')
    case '23503':
      return new HttpError(409, 'No se puede completar: hay datos relacionados')
    case '23514':
      return new HttpError(400, 'Los datos no cumplen una regla de validacion')
    case '23502':
      return new HttpError(400, 'Falta un campo obligatorio')
    case '22P02':
      return new HttpError(400, 'Formato de dato invalido')
    case '22007':
    case '22008':
      return new HttpError(400, 'Fecha u hora invalida')
    case '22001':
      return new HttpError(400, 'El texto es demasiado largo')
    case 'P0001': {
      const message = error.message

      if (/no encontrad/i.test(message)) {
        return new HttpError(404, message)
      }

      if (/ya existe/i.test(message)) {
        return new HttpError(409, message)
      }

      return new HttpError(400, message)
    }
    default:
      return null
  }
}
