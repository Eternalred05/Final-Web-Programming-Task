import { query } from '../config/db'
import type { Departamento } from '../types/departamento'

export async function getAllDepartamentos(): Promise<Departamento[]> {
  const { rows } = await query<Departamento>(
    'SELECT coddpt, nombredpt, codhospital FROM departamento ORDER BY coddpt ASC',
  )
  return rows
}

export async function getDepartamentoById(coddpt: string): Promise<Departamento | null> {
  const { rows } = await query<Departamento>(
    'SELECT coddpt, nombredpt, codhospital FROM departamento WHERE coddpt = $1',
    [coddpt],
  )
  return rows[0] ?? null
}

export async function createDepartamento(coddpt: string, nombredpt: string, codhospital: string): Promise<Departamento> {
  const { rows } = await query<Departamento>(
    'INSERT INTO departamento (coddpt, nombredpt, codhospital) VALUES ($1, $2, $3) RETURNING coddpt, nombredpt, codhospital',
    [coddpt, nombredpt, codhospital],
  )
  return rows[0]
}

export async function updateDepartamento(coddpt: string, nombredpt: string, codhospital: string): Promise<Departamento | null> {
  const { rows } = await query<Departamento>(
    'UPDATE departamento SET nombredpt = $1, codhospital = $2 WHERE coddpt = $3 RETURNING coddpt, nombredpt, codhospital',
    [nombredpt, codhospital, coddpt],
  )
  return rows[0] ?? null
}

export async function deleteDepartamento(coddpt: string): Promise<boolean> {
  const { rows } = await query<{ coddpt: string }>(
    'DELETE FROM departamento WHERE coddpt = $1 RETURNING coddpt',
    [coddpt],
  )
  return rows.length > 0
}
