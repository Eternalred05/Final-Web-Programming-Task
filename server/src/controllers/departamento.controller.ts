import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  createDepartamento,
  deleteDepartamento,
  getAllDepartamentos,
  getDepartamentoById,
  updateDepartamento,
} from '../services/departamento.service'
import { HttpError } from '../utils/httpError'

const departamentoSchema = z.object({
  coddpt: z.string().trim().min(1, 'El codigo del departamento es obligatorio'),
  nombredpt: z.string().trim().min(1, 'El nombre del departamento es obligatorio'),
  codhospital: z.string().trim().min(1, 'El codigo del hospital es obligatorio'),
})

const idSchema = z.object({
  coddpt: z.string().trim().min(1, 'El codigo del departamento es obligatorio'),
})

export async function getDepartamentos(_req: Request, res: Response): Promise<void> {
  const departamentos = await getAllDepartamentos()
  res.json(departamentos)
}

export async function getDepartamento(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const departamento = await getDepartamentoById(parsed.data.coddpt)

  if (!departamento) {
    throw new HttpError(404, 'Departamento no encontrado')
  }

  res.json(departamento)
}

export async function createDepartamentoController(req: Request, res: Response): Promise<void> {
  const parsed = departamentoSchema.safeParse(req.body)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const departamento = await createDepartamento(parsed.data.coddpt, parsed.data.nombredpt, parsed.data.codhospital)
  res.status(201).json(departamento)
}

export async function updateDepartamentoController(req: Request, res: Response): Promise<void> {
  const parsedParams = idSchema.safeParse(req.params)
  const parsedBody = departamentoSchema.pick({ nombredpt: true, codhospital: true }).safeParse(req.body)

  if (!parsedParams.success) {
    throw new HttpError(400, 'Datos invalidos', parsedParams.error.flatten().fieldErrors)
  }

  if (!parsedBody.success) {
    throw new HttpError(400, 'Datos invalidos', parsedBody.error.flatten().fieldErrors)
  }

  const departamento = await updateDepartamento(parsedParams.data.coddpt, parsedBody.data.nombredpt, parsedBody.data.codhospital)

  if (!departamento) {
    throw new HttpError(404, 'Departamento no encontrado')
  }

  res.json(departamento)
}

export async function deleteDepartamentoController(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const deleted = await deleteDepartamento(parsed.data.coddpt)

  if (!deleted) {
    throw new HttpError(404, 'Departamento no encontrado')
  }

  res.status(204).send()
}
