import { query } from '../config/db'
import type { Unidad } from '../types/unidad'

export async function getAllUnidades(): Promise<Unidad[]> {
  const { rows } = await query<Unidad>(
    'SELECT codunidad, nombreunidad, ubicacion, coddpt FROM unidad ORDER BY codunidad ASC',
  )
  return rows
}

export async function getUnidadById(codunidad: number): Promise<Unidad | null> {
  const { rows } = await query<Unidad>(
    'SELECT codunidad, nombreunidad, ubicacion, coddpt FROM unidad WHERE codunidad = $1',
    [codunidad],
  )
  return rows[0] ?? null
}

export async function createUnidad(nombreunidad: string, ubicacion: string, coddpt: number): Promise<Unidad> {
  const { rows } = await query<Unidad>(
    'INSERT INTO unidad (nombreunidad, ubicacion, coddpt) VALUES ($1, $2, $3) RETURNING codunidad, nombreunidad, ubicacion, coddpt',
    [nombreunidad, ubicacion, coddpt],
  )
  return rows[0]
}

export async function updateUnidad(codunidad: number, nombreunidad: string, ubicacion: string, coddpt: number): Promise<Unidad | null> {
  const { rows } = await query<Unidad>(
    'UPDATE unidad SET nombreunidad = $1, ubicacion = $2, coddpt = $3 WHERE codunidad = $4 RETURNING codunidad, nombreunidad, ubicacion, coddpt',
    [nombreunidad, ubicacion, coddpt, codunidad],
  )
  return rows[0] ?? null
}

export async function deleteUnidad(codunidad: number): Promise<boolean> {
  const { rows } = await query<{ codunidad: number }>(
    'DELETE FROM unidad WHERE codunidad = $1 RETURNING codunidad',
    [codunidad],
  )
  return rows.length > 0
}