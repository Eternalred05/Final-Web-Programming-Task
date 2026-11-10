import { query } from '../config/db'
import type { Turno } from '../types/turno'

export async function getAllTurnos(): Promise<Turno[]> {
  const { rows } = await query<Turno>(
    'SELECT codunidad, numturno, cantpacientes, pacientesatend, codmedico FROM turno ORDER BY codunidad ASC, numturno ASC',
  )
  return rows
}

export async function getTurnoById(codunidad: string, numturno: number): Promise<Turno | null> {
  const { rows } = await query<Turno>(
    'SELECT codunidad, numturno, cantpacientes, pacientesatend, codmedico FROM turno WHERE codunidad = $1 AND numturno = $2',
    [codunidad, numturno],
  )
  return rows[0] ?? null
}

export async function createTurno(codunidad: string, numturno: number, cantpacientes: number, pacientesatend: number, codmedico: string): Promise<Turno> {
  const { rows } = await query<Turno>(
    'INSERT INTO turno (codunidad, numturno, cantpacientes, pacientesatend, codmedico) VALUES ($1, $2, $3, $4, $5) RETURNING codunidad, numturno, cantpacientes, pacientesatend, codmedico',
    [codunidad, numturno, cantpacientes, pacientesatend, codmedico],
  )
  return rows[0]
}

export async function updateTurno(codunidad: string, numturno: number, cantpacientes: number, pacientesatend: number, codmedico: string): Promise<Turno | null> {
  const { rows } = await query<Turno>(
    'UPDATE turno SET cantpacientes = $1, pacientesatend = $2, codmedico = $3 WHERE codunidad = $4 AND numturno = $5 RETURNING codunidad, numturno, cantpacientes, pacientesatend, codmedico',
    [cantpacientes, pacientesatend, codmedico, codunidad, numturno],
  )
  return rows[0] ?? null
}

export async function deleteTurno(codunidad: string, numturno: number): Promise<boolean> {
  const { rows } = await query<{ codunidad: string }>(
    'DELETE FROM turno WHERE codunidad = $1 AND numturno = $2 RETURNING codunidad',
    [codunidad, numturno],
  )
  return rows.length > 0
}
