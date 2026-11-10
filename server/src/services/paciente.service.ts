import { pool, query } from '../config/db'
import type { Paciente } from '../types/paciente'

export async function getAllPacientes(): Promise<Paciente[]> {
  const { rows } = await query<Paciente>(
    'SELECT codunidad, numhistclinica, nombrepac, direccion, nacimiento, atendido, causa FROM paciente ORDER BY codunidad ASC, numhistclinica ASC',
  )
  return rows
}

export async function getPacienteById(codunidad: number, numhistclinica: string): Promise<Paciente | null> {
  const { rows } = await query<Paciente>(
    'SELECT codunidad, numhistclinica, nombrepac, direccion, nacimiento, atendido, causa FROM paciente WHERE codunidad = $1 AND numhistclinica = $2',
    [codunidad, numhistclinica],
  )
  return rows[0] ?? null
}

export async function createPaciente(
  codunidad: number,
  numhistclinica: string,
  nombrepac: string,
  direccion: string,
  nacimiento: string,
  atendido: boolean,
  causa: string | null,
): Promise<Paciente> {
  const { rows } = await query<Paciente>(
    'INSERT INTO paciente (codunidad, numhistclinica, nombrepac, direccion, nacimiento, atendido, causa) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING codunidad, numhistclinica, nombrepac, direccion, nacimiento, atendido, causa',
    [codunidad, numhistclinica, nombrepac, direccion, nacimiento, atendido, causa],
  )
  return rows[0]
}

export async function updatePaciente(
  codunidad: number,
  numhistclinica: string,
  nombrepac: string,
  direccion: string,
  nacimiento: string,
  atendido: boolean,
  causa: string | null,
): Promise<Paciente | null> {
  const { rows } = await query<Paciente>(
    'UPDATE paciente SET nombrepac = $1, direccion = $2, nacimiento = $3, atendido = $4, causa = $5 WHERE codunidad = $6 AND numhistclinica = $7 RETURNING codunidad, numhistclinica, nombrepac, direccion, nacimiento, atendido, causa',
    [nombrepac, direccion, nacimiento, atendido, causa, codunidad, numhistclinica],
  )
  return rows[0] ?? null
}

export async function deletePaciente(codunidad: number, numhistclinica: string): Promise<boolean> {
  const { rows } = await query<{ codunidad: number }>(
    'DELETE FROM paciente WHERE codunidad = $1 AND numhistclinica = $2 RETURNING codunidad',
    [codunidad, numhistclinica],
  )
  return rows.length > 0
}

export async function listarNoAtendidosPorUnidad(codunidad: number): Promise<Paciente[]> {
  const { rows } = await query<Paciente>(
    `SELECT codunidad, numhistclinica, nombrepac, direccion, nacimiento, atendido, causa
     FROM paciente
     WHERE codunidad = $1 AND atendido = FALSE
     ORDER BY nombrepac`,
    [codunidad],
  )
  return rows
}

export type ResultadoAtender =
  | { ok: true; mensaje: string }
  | { ok: false; mensaje: string }

export async function atenderPaciente(
  codunidad: number,
  numhistclinica: string,
  numturno: number,
): Promise<ResultadoAtender> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const resPac = await client.query(
      `UPDATE paciente
       SET atendido = TRUE, causa = NULL
       WHERE codunidad = $1 AND numhistclinica = $2 AND atendido = FALSE`,
      [codunidad, numhistclinica],
    )

    if (resPac.rowCount === 0) {
      await client.query('ROLLBACK')
      return { ok: false, mensaje: 'El paciente ya estaba atendido o no existe.' }
    }

    const resTur = await client.query(
      `UPDATE turno
       SET pacientesatend = pacientesatend + 1
       WHERE codunidad = $1 AND numturno = $2 AND pacientesatend < cantpacientes`,
      [codunidad, numturno],
    )

    if (resTur.rowCount === 0) {
      await client.query('ROLLBACK')
      return {
        ok: false,
        mensaje: 'No se puede atender: ya se ha alcanzado el máximo de pacientes del turno.',
      }
    }

    await client.query('COMMIT')
    return { ok: true, mensaje: 'Paciente atendido correctamente.' }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

export async function agregarCausa(
  codunidad: number,
  numhistclinica: string,
  causa: string,
): Promise<ResultadoAtender> {
  const { rowCount } = await query(
    `UPDATE paciente
     SET causa = $1
     WHERE codunidad = $2 AND numhistclinica = $3 AND atendido = FALSE`,
    [causa, codunidad, numhistclinica],
  )

  if (rowCount === 0) {
    return { ok: false, mensaje: 'El paciente ya fue atendido o no se encontró.' }
  }
  return { ok: true, mensaje: 'Causa registrada correctamente.' }
}