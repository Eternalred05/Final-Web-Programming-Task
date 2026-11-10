import { query } from '../config/db'
import type { Hospital } from '../types/hospital'

export async function getAllHospitals(): Promise<Hospital[]> {
  const { rows } = await query<Hospital>(
    'SELECT codhospital, nombrehosp FROM hospital ORDER BY codhospital ASC',
  )
  return rows
}

export async function getHospitalById(codhospital: number): Promise<Hospital | null> {
  const { rows } = await query<Hospital>(
    'SELECT codhospital, nombrehosp FROM hospital WHERE codhospital = $1',
    [codhospital],
  )
  return rows[0] ?? null
}

export async function createHospital(nombrehosp: string): Promise<Hospital> {
  const { rows } = await query<Hospital>(
    'INSERT INTO hospital (nombrehosp) VALUES ($1) RETURNING codhospital, nombrehosp',
    [nombrehosp],
  )
  return rows[0]
}

export async function updateHospital(codhospital: number, nombrehosp: string): Promise<Hospital | null> {
  const { rows } = await query<Hospital>(
    'UPDATE hospital SET nombrehosp = $1 WHERE codhospital = $2 RETURNING codhospital, nombrehosp',
    [nombrehosp, codhospital],
  )
  return rows[0] ?? null
}

export async function deleteHospital(codhospital: number): Promise<boolean> {
  const { rows } = await query<{ codhospital: number }>(
    'DELETE FROM hospital WHERE codhospital = $1 RETURNING codhospital',
    [codhospital],
  )
  return rows.length > 0
}
