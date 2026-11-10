import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  createTurno,
  deleteTurno,
  getAllTurnos,
  getTurnoById,
  updateTurno,
} from '../services/turno.service'
import { HttpError } from '../utils/httpError'

const turnoSchema = z
  .object({
    codunidad: z.coerce.number().int().positive('El codigo de la unidad es obligatorio'),
    numturno: z.coerce.number().int().positive('El numero de turno debe ser valido'),
    cantpacientes: z.coerce.number().int().nonnegative('La cantidad de pacientes debe ser valida'),
    pacientesatend: z.coerce.number().int().nonnegative('La cantidad de pacientes atendidos debe ser valida'),
    codmedico: z.coerce.number().int().positive('El codigo del medico es obligatorio'),
  })
  .refine((data) => data.pacientesatend <= data.cantpacientes, {
    message: 'Los pacientes atendidos no pueden superar a los asignados',
    path: ['pacientesatend'],
  })

const idSchema = z.object({
  codunidad: z.coerce.number().int().positive('El codigo de la unidad es obligatorio'),
  numturno: z.coerce.number().int().positive('El numero de turno debe ser valido'),
})

export async function getTurnos(_req: Request, res: Response): Promise<void> {
  const turnos = await getAllTurnos()
  res.json(turnos)
}

export async function getTurno(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const turno = await getTurnoById(parsed.data.codunidad, parsed.data.numturno)

  if (!turno) {
    throw new HttpError(404, 'Turno no encontrado')
  }

  res.json(turno)
}

export async function createTurnoController(req: Request, res: Response): Promise<void> {
  const parsed = turnoSchema.safeParse(req.body)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const turno = await createTurno(
    parsed.data.codunidad,
    parsed.data.numturno,
    parsed.data.cantpacientes,
    parsed.data.pacientesatend,
    parsed.data.codmedico,
  )
  res.status(201).json(turno)
}

export async function updateTurnoController(req: Request, res: Response): Promise<void> {
  const parsedParams = idSchema.safeParse(req.params)
  const parsedBody = turnoSchema
    .pick({
      cantpacientes: true,
      pacientesatend: true,
      codmedico: true,
    })
    .refine((data) => data.pacientesatend <= data.cantpacientes, {
      message: 'Los pacientes atendidos no pueden superar a los asignados',
      path: ['pacientesatend'],
    })
    .safeParse(req.body)

  if (!parsedParams.success) {
    throw new HttpError(400, 'Datos invalidos', parsedParams.error.flatten().fieldErrors)
  }

  if (!parsedBody.success) {
    throw new HttpError(400, 'Datos invalidos', parsedBody.error.flatten().fieldErrors)
  }

  const turno = await updateTurno(
    parsedParams.data.codunidad,
    parsedParams.data.numturno,
    parsedBody.data.cantpacientes,
    parsedBody.data.pacientesatend,
    parsedBody.data.codmedico,
  )

  if (!turno) {
    throw new HttpError(404, 'Turno no encontrado')
  }

  res.json(turno)
}

export async function deleteTurnoController(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const deleted = await deleteTurno(parsed.data.codunidad, parsed.data.numturno)

  if (!deleted) {
    throw new HttpError(404, 'Turno no encontrado')
  }

  res.status(204).send()
}