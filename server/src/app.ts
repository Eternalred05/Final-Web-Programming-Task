import cors from 'cors'
import express from 'express'
import { query } from './config/db'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import { authRouter } from './routes/auth.routes'
import { hospitalRouter } from './routes/hospital.routes'
import { departamentoRouter } from './routes/departamento.routes'
import { unidadRouter } from './routes/unidad.routes'
import { doctorRouter } from './routes/doctor.routes'
import { pacienteRouter } from './routes/paciente.routes'
import { turnoRouter } from './routes/turno.routes'
import { informeRouter } from './routes/informe.routes'

export const app = express()

app.use(cors({ origin: env.corsOrigin }))
app.use(express.json())

app.get('/api/health', async (_req, res) => {
  const { rows } = await query<{ now: string }>('SELECT NOW() AS now')

  res.json({
    status: 'ok',
    database: 'connected',
    timestamp: rows[0].now,
  })
})

app.use('/api/auth', authRouter)
app.use('/api/hospitales', hospitalRouter)
app.use('/api/departamentos', departamentoRouter)
app.use('/api/unidades', unidadRouter)
app.use('/api/doctores', doctorRouter)
app.use('/api/pacientes', pacienteRouter)
app.use('/api/turnos', turnoRouter)
app.use('/api/informes', informeRouter)

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

app.use(errorHandler)
