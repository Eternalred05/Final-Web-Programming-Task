import 'dotenv/config'
import { Pool, type QueryResultRow } from 'pg'

export const pool = new Pool()

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
) {
  return pool.query<T>(text, params)
}

export async function closePool(): Promise<void> {
  await pool.end()
}
