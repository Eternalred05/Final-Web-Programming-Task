import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  createPaciente,
  deletePaciente,
  getAllPacientes,
  getPacienteById,
  updatePaciente,
  agregarCausa,
  atenderPaciente,
  listarNoAtendidosPorUnidad,
} from '../services/paciente.service'
import { HttpError } from '../utils/httpError'

const booleanFromForm = z.preprocess(
  (val) => val === true || val === 'true' || val === '1' || val === 1,
  z.boolean(),
)

const pacienteSchema = z.object({
  codunidad: z.coerce.number().int().positive('El codigo de la unidad es obligatorio'),
  numhistclinica: z.string().trim().min(1, 'El numero de historia clinica es obligatorio'),
  nombrepac: z.string().trim().min(1, 'El nombre del paciente es obligatorio'),
  direccion: z.string().trim().min(1, 'La direccion es obligatoria'),
  nacimiento: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD'),
  atendido: booleanFromForm,
  causa: z.string().trim().nullable().optional(),
})

const idSchema = z.object({
  codunidad: z.coerce.number().int().positive('El codigo de la unidad es obligatorio'),
  numhistclinica: z.string().trim().min(1, 'El numero de historia clinica es obligatorio'),
})

const noAtendidosParamSchema = z.object({
  codunidad: z.coerce.number().int().positive('El codigo de la unidad es obligatorio'),
})

const atenderBodySchema = z.object({
  codunidad: z.coerce.number().int().positive('La unidad es obligatoria'),
  numhistclinica: z.string().trim().min(1, 'La historia clinica es obligatoria'),
  numturno: z.coerce.number().int().positive('El turno es obligatorio'),
})

const causaBodySchema = z.object({
  codunidad: z.coerce.number().int().positive('La unidad es obligatoria'),
  numhistclinica: z.string().trim().min(1, 'La historia clinica es obligatoria'),
  causa: z.string().trim().min(1, 'La causa es obligatoria'),
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

  const causaFinal = parsed.data.atendido ? null : (parsed.data.causa ?? null)

  const paciente = await createPaciente(
    parsed.data.codunidad,
    parsed.data.numhistclinica,
    parsed.data.nombrepac,
    parsed.data.direccion,
    parsed.data.nacimiento,
    parsed.data.atendido,
    causaFinal,
  )
  res.status(201).json(paciente)
}

export async function updatePacienteController(req: Request, res: Response): Promise<void> {
  const parsedParams = idSchema.safeParse(req.params)
  const parsedBody = pacienteSchema
    .pick({
      nombrepac: true,
      direccion: true,
      nacimiento: true,
      atendido: true,
      causa: true,
    })
    .safeParse(req.body)

  if (!parsedParams.success) {
    throw new HttpError(400, 'Datos invalidos', parsedParams.error.flatten().fieldErrors)
  }

  if (!parsedBody.success) {
    throw new HttpError(400, 'Datos invalidos', parsedBody.error.flatten().fieldErrors)
  }

  const causaFinal = parsedBody.data.atendido ? null : (parsedBody.data.causa ?? null)

  const paciente = await updatePaciente(
    parsedParams.data.codunidad,
    parsedParams.data.numhistclinica,
    parsedBody.data.nombrepac,
    parsedBody.data.direccion,
    parsedBody.data.nacimiento,
    parsedBody.data.atendido,
    causaFinal,
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

export async function getPacientesNoAtendidos(req: Request, res: Response): Promise<void> {
  const parsed = noAtendidosParamSchema.safeParse(req.params)
  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const pacientes = await listarNoAtendidosPorUnidad(parsed.data.codunidad)
  res.json(pacientes)
}

export async function atenderPacienteController(req: Request, res: Response): Promise<void> {
  const parsed = atenderBodySchema.safeParse(req.body)
  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const resultado = await atenderPaciente(
    parsed.data.codunidad,
    parsed.data.numhistclinica,
    parsed.data.numturno,
  )

  if (!resultado.ok) {
    throw new HttpError(409, resultado.mensaje)
  }

  res.json({ mensaje: resultado.mensaje })
}

export async function agregarCausaController(req: Request, res: Response): Promise<void> {
  const parsed = causaBodySchema.safeParse(req.body)
  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const resultado = await agregarCausa(
    parsed.data.codunidad,
    parsed.data.numhistclinica,
    parsed.data.causa,
  )

  if (!resultado.ok) {
    throw new HttpError(409, resultado.mensaje)
  }

  res.json({ mensaje: resultado.mensaje })
}