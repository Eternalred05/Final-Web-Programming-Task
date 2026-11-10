import { query } from '../config/db'
import type { Informe } from '../types/informe'

export async function getAllInformes(): Promise<Informe[]> {
  const { rows } = await query<Informe>(
    'SELECT codunidad, numinforme, fecha, hora, pacientesatendinf, pacientesalta, pacientesadmit, pacientesregist, numturno FROM informe ORDER BY codunidad ASC, numinforme ASC',
  )
  return rows
}

export async function getInformeById(codunidad: string, numinforme: number): Promise<Informe | null> {
  const { rows } = await query<Informe>(
    'SELECT codunidad, numinforme, fecha, hora, pacientesatendinf, pacientesalta, pacientesadmit, pacientesregist, numturno FROM informe WHERE codunidad = $1 AND numinforme = $2',
    [codunidad, numinforme],
  )
  return rows[0] ?? null
}

export async function createInforme(
  codunidad: string,
  numinforme: number,
  fecha: string,
  hora: string,
  pacientesatendinf: number,
  pacientesalta: number,
  pacientesadmit: number,
  pacientesregist: number,
  numturno: number,
): Promise<Informe> {
  const { rows } = await query<Informe>(
    'INSERT INTO informe (codunidad, numinforme, fecha, hora, pacientesatendinf, pacientesalta, pacientesadmit, pacientesregist, numturno) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING codunidad, numinforme, fecha, hora, pacientesatendinf, pacientesalta, pacientesadmit, pacientesregist, numturno',
    [codunidad, numinforme, fecha, hora, pacientesatendinf, pacientesalta, pacientesadmit, pacientesregist, numturno],
  )
  return rows[0]
}

export async function updateInforme(
  codunidad: string,
  numinforme: number,
  fecha: string,
  hora: string,
  pacientesatendinf: number,
  pacientesalta: number,
  pacientesadmit: number,
  pacientesregist: number,
  numturno: number,
): Promise<Informe | null> {
  const { rows } = await query<Informe>(
    'UPDATE informe SET fecha = $1, hora = $2, pacientesatendinf = $3, pacientesalta = $4, pacientesadmit = $5, pacientesregist = $6, numturno = $7 WHERE codunidad = $8 AND numinforme = $9 RETURNING codunidad, numinforme, fecha, hora, pacientesatendinf, pacientesalta, pacientesadmit, pacientesregist, numturno',
    [fecha, hora, pacientesatendinf, pacientesalta, pacientesadmit, pacientesregist, numturno, codunidad, numinforme],
  )
  return rows[0] ?? null
}

export async function deleteInforme(codunidad: string, numinforme: number): Promise<boolean> {
  const { rows } = await query<{ codunidad: string }>(
    'DELETE FROM informe WHERE codunidad = $1 AND numinforme = $2 RETURNING codunidad',
    [codunidad, numinforme],
  )
  return rows.length > 0
}
