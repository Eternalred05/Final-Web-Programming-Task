import { query } from '../config/db'
import type { Paciente } from '../types/paciente'

export async function getAllPacientes(): Promise<Paciente[]> {
  const { rows } = await query<Paciente>(
    'SELECT codunidad, numhistclinica, nombrepac, direccion, nacimiento, atendido, causa FROM paciente ORDER BY codunidad ASC, numhistclinica ASC',
  )
  return rows
}

export async function getPacienteById(codunidad: string, numhistclinica: string): Promise<Paciente | null> {
  const { rows } = await query<Paciente>(
    'SELECT codunidad, numhistclinica, nombrepac, direccion, nacimiento, atendido, causa FROM paciente WHERE codunidad = $1 AND numhistclinica = $2',
    [codunidad, numhistclinica],
  )
  return rows[0] ?? null
}

export async function createPaciente(
  codunidad: string,
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
  codunidad: string,
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

export async function deletePaciente(codunidad: string, numhistclinica: string): Promise<boolean> {
  const { rows } = await query<{ codunidad: string }>(
    'DELETE FROM paciente WHERE codunidad = $1 AND numhistclinica = $2 RETURNING codunidad',
    [codunidad, numhistclinica],
  )
  return rows.length > 0
}
