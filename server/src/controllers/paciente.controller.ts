import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  createPaciente,
  deletePaciente,
  getAllPacientes,
  getPacienteById,
  updatePaciente,
} from '../services/paciente.service'
import { HttpError } from '../utils/httpError'

const pacienteSchema = z.object({
  codunidad: z.string().trim().min(1, 'El codigo de la unidad es obligatorio'),
  numhistclinica: z.string().trim().min(1, 'El numero de historia clinica es obligatorio'),
  nombrepac: z.string().trim().min(1, 'El nombre del paciente es obligatorio'),
  direccion: z.string().trim().min(1, 'La direccion es obligatoria'),
  nacimiento: z.string().trim().min(1, 'La fecha de nacimiento es obligatoria'),
  atendido: z.coerce.boolean(),
  causa: z.string().trim().nullable().optional(),
})

const idSchema = z.object({
  codunidad: z.string().trim().min(1, 'El codigo de la unidad es obligatorio'),
  numhistclinica: z.string().trim().min(1, 'El numero de historia clinica es obligatorio'),
})

export async function getPacientes(_req: Request, res: Response): Promise<void> {
  const pacientes = await getAllPacientes()
  res.json(pacientes)
}

export async function getPaciente(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const paciente = await getPacienteById(parsed.data.codunidad, parsed.data.numhistclinica)

  if (!paciente) {
    throw new HttpError(404, 'Paciente no encontrado')
  }

  res.json(paciente)
}

export async function createPacienteController(req: Request, res: Response): Promise<void> {
  const parsed = pacienteSchema.safeParse(req.body)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const paciente = await createPaciente(
    parsed.data.codunidad,
    parsed.data.numhistclinica,
    parsed.data.nombrepac,
    parsed.data.direccion,
    parsed.data.nacimiento,
    parsed.data.atendido,
    parsed.data.causa ?? null,
  )
  res.status(201).json(paciente)
}

export async function updatePacienteController(req: Request, res: Response): Promise<void> {
  const parsedParams = idSchema.safeParse(req.params)
  const parsedBody = pacienteSchema.pick({
    nombrepac: true,
    direccion: true,
    nacimiento: true,
    atendido: true,
    causa: true,
  }).safeParse(req.body)

  if (!parsedParams.success) {
    throw new HttpError(400, 'Datos invalidos', parsedParams.error.flatten().fieldErrors)
  }

  if (!parsedBody.success) {
    throw new HttpError(400, 'Datos invalidos', parsedBody.error.flatten().fieldErrors)
  }

  const paciente = await updatePaciente(
    parsedParams.data.codunidad,
    parsedParams.data.numhistclinica,
    parsedBody.data.nombrepac,
    parsedBody.data.direccion,
    parsedBody.data.nacimiento,
    parsedBody.data.atendido,
    parsedBody.data.causa ?? null,
  )

  if (!paciente) {
    throw new HttpError(404, 'Paciente no encontrado')
  }

  res.json(paciente)
}

export async function deletePacienteController(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const deleted = await deletePaciente(parsed.data.codunidad, parsed.data.numhistclinica)

  if (!deleted) {
    throw new HttpError(404, 'Paciente no encontrado')
  }

  res.status(204).send()
}
