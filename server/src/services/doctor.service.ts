import { query } from '../config/db'
import type { Doctor } from '../types/doctor'

export async function getAllDoctors(): Promise<Doctor[]> {
  const { rows } = await query<Doctor>(
    'SELECT codmedico, nombremed, telefono, especialidad, numlicencia, experiencia, codunidad FROM doctor ORDER BY codmedico ASC',
  )
  return rows
}

export async function getDoctorById(codmedico: number): Promise<Doctor | null> {
  const { rows } = await query<Doctor>(
    'SELECT codmedico, nombremed, telefono, especialidad, numlicencia, experiencia, codunidad FROM doctor WHERE codmedico = $1',
    [codmedico],
  )
  return rows[0] ?? null
}

export async function createDoctor(
  nombremed: string,
  telefono: string | null,
  especialidad: string,
  numlicencia: string,
  experiencia: number,
  codunidad: number,
): Promise<Doctor> {
  const { rows } = await query<Doctor>(
    'INSERT INTO doctor (nombremed, telefono, especialidad, numlicencia, experiencia, codunidad) VALUES ($1, $2, $3, $4, $5, $6) RETURNING codmedico, nombremed, telefono, especialidad, numlicencia, experiencia, codunidad',
    [nombremed, telefono, especialidad, numlicencia, experiencia, codunidad],
  )
  return rows[0]
}

export async function updateDoctor(
  codmedico: number,
  nombremed: string,
  telefono: string,
  especialidad: string,
  numlicencia: string,
  experiencia: number,
  codunidad: number,
): Promise<Doctor | null> {
  const { rows } = await query<Doctor>(
    'UPDATE doctor SET nombremed = $1, telefono = $2, especialidad = $3, numlicencia = $4, experiencia = $5, codunidad = $6 WHERE codmedico = $7 RETURNING codmedico, nombremed, telefono, especialidad, numlicencia, experiencia, codunidad',
    [nombremed, telefono, especialidad, numlicencia, experiencia, codunidad, codmedico],
  )
  return rows[0] ?? null
}

export async function deleteDoctor(codmedico: number): Promise<boolean> {
  const { rows } = await query<{ codmedico: number }>(
    'DELETE FROM doctor WHERE codmedico = $1 RETURNING codmedico',
    [codmedico],
  )
  return rows.length > 0
}