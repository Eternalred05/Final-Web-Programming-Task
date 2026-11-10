import { query } from '../config/db'
import type { Doctor } from '../types/doctor'

export async function getAllDoctors(): Promise<Doctor[]> {
  const { rows } = await query<Doctor>(
    'SELECT codmedico, nombremed, telefono, especialidad, numlicencia, experiencia, codunidad FROM doctor ORDER BY codmedico ASC',
  )
  return rows
}

export async function getDoctorById(codmedico: string): Promise<Doctor | null> {
  const { rows } = await query<Doctor>(
    'SELECT codmedico, nombremed, telefono, especialidad, numlicencia, experiencia, codunidad FROM doctor WHERE codmedico = $1',
    [codmedico],
  )
  return rows[0] ?? null
}

export async function createDoctor(
  codmedico: string,
  nombremed: string,
  telefono: string | null,
  especialidad: string,
  numlicencia: string,
  experiencia: number,
  codunidad: string,
): Promise<Doctor> {
  const { rows } = await query<Doctor>(
    'INSERT INTO doctor (codmedico, nombremed, telefono, especialidad, numlicencia, experiencia, codunidad) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING codmedico, nombremed, telefono, especialidad, numlicencia, experiencia, codunidad',
    [codmedico, nombremed, telefono, especialidad, numlicencia, experiencia, codunidad],
  )
  return rows[0]
}

export async function updateDoctor(
  codmedico: string,
  nombremed: string,
  telefono: string | null,
  especialidad: string,
  numlicencia: string,
  experiencia: number,
  codunidad: string,
): Promise<Doctor | null> {
  const { rows } = await query<Doctor>(
    'UPDATE doctor SET nombremed = $1, telefono = $2, especialidad = $3, numlicencia = $4, experiencia = $5, codunidad = $6 WHERE codmedico = $7 RETURNING codmedico, nombremed, telefono, especialidad, numlicencia, experiencia, codunidad',
    [nombremed, telefono, especialidad, numlicencia, experiencia, codunidad, codmedico],
  )
  return rows[0] ?? null
}

export async function deleteDoctor(codmedico: string): Promise<boolean> {
  const { rows } = await query<{ codmedico: string }>(
    'DELETE FROM doctor WHERE codmedico = $1 RETURNING codmedico',
    [codmedico],
  )
  return rows.length > 0
}
