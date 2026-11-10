import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  createUnidad,
  deleteUnidad,
  getAllUnidades,
  getUnidadById,
  updateUnidad,
} from '../services/unidad.service'
import { HttpError } from '../utils/httpError'

const unidadSchema = z.object({
  nombreunidad: z.string().trim().min(1, 'El nombre de la unidad es obligatorio'),
  ubicacion: z.string().trim().min(1, 'La ubicacion es obligatoria'),
  coddpt: z.coerce.number().int().positive('El codigo del departamento es obligatorio'),
})

const idSchema = z.object({
  codunidad: z.coerce.number().int().positive('El codigo de la unidad debe ser un numero positivo'),
})

export async function getUnidades(_req: Request, res: Response): Promise<void> {
  const unidades = await getAllUnidades()
  res.json(unidades)
}

export async function getUnidad(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const unidad = await getUnidadById(parsed.data.codunidad)

  if (!unidad) {
    throw new HttpError(404, 'Unidad no encontrada')
  }

  res.json(unidad)
}

export async function createUnidadController(req: Request, res: Response): Promise<void> {
  const parsed = unidadSchema.safeParse(req.body)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const unidad = await createUnidad(parsed.data.nombreunidad, parsed.data.ubicacion, parsed.data.coddpt)
  res.status(201).json(unidad)
}

export async function updateUnidadController(req: Request, res: Response): Promise<void> {
  const parsedParams = idSchema.safeParse(req.params)
  const parsedBody = unidadSchema.pick({ nombreunidad: true, ubicacion: true, coddpt: true }).safeParse(req.body)

  if (!parsedParams.success) {
    throw new HttpError(400, 'Datos invalidos', parsedParams.error.flatten().fieldErrors)
  }

  if (!parsedBody.success) {
    throw new HttpError(400, 'Datos invalidos', parsedBody.error.flatten().fieldErrors)
  }

  const unidad = await updateUnidad(parsedParams.data.codunidad, parsedBody.data.nombreunidad, parsedBody.data.ubicacion, parsedBody.data.coddpt)

  if (!unidad) {
    throw new HttpError(404, 'Unidad no encontrada')
  }

  res.json(unidad)
}

export async function deleteUnidadController(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const deleted = await deleteUnidad(parsed.data.codunidad)

  if (!deleted) {
    throw new HttpError(404, 'Unidad no encontrada')
  }

  res.status(204).send()
}