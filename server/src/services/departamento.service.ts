import { query } from '../config/db'
import type { Departamento } from '../types/departamento'

export async function getAllDepartamentos(): Promise<Departamento[]> {
  const { rows } = await query<Departamento>(
    'SELECT coddpt, nombredpt, codhospital FROM departamento ORDER BY coddpt ASC',
  )
  return rows
}

export async function getDepartamentoById(coddpt: number): Promise<Departamento | null> {
  const { rows } = await query<Departamento>(
    'SELECT coddpt, nombredpt, codhospital FROM departamento WHERE coddpt = $1',
    [coddpt],
  )
  return rows[0] ?? null
}

export async function createDepartamento(nombredpt: string, codhospital: number): Promise<Departamento> {
  const { rows } = await query<Departamento>(
    'INSERT INTO departamento (nombredpt, codhospital) VALUES ($1, $2) RETURNING coddpt, nombredpt, codhospital',
    [nombredpt, codhospital],
  )
  return rows[0]
}

export async function updateDepartamento(coddpt: number, nombredpt: string, codhospital: number): Promise<Departamento | null> {
  const { rows } = await query<Departamento>(
    'UPDATE departamento SET nombredpt = $1, codhospital = $2 WHERE coddpt = $3 RETURNING coddpt, nombredpt, codhospital',
    [nombredpt, codhospital, coddpt],
  )
  return rows[0] ?? null
}

export async function deleteDepartamento(coddpt: number): Promise<boolean> {
  const { rows } = await query<{ coddpt: number }>(
    'DELETE FROM departamento WHERE coddpt = $1 RETURNING coddpt',
    [coddpt],
  )
  return rows.length > 0
}