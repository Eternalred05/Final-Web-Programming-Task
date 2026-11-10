import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  createHospital,
  deleteHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
} from '../services/hospital.service'
import { HttpError } from '../utils/httpError'

const hospitalSchema = z.object({
  nombrehosp: z.string().trim().min(1, 'El nombre del hospital es obligatorio'),
})

const idSchema = z.object({
  codhospital: z.coerce.number().int().positive('El codigo es obligatorio'),
})

export async function getHospitals(_req: Request, res: Response): Promise<void> {
  const hospitals = await getAllHospitals()
  res.json(hospitals)
}

export async function getHospital(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const hospital = await getHospitalById(parsed.data.codhospital)

  if (!hospital) {
    throw new HttpError(404, 'Hospital no encontrado')
  }

  res.json(hospital)
}

export async function createHospitalController(req: Request, res: Response): Promise<void> {
  const parsed = hospitalSchema.safeParse(req.body)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const hospital = await createHospital(parsed.data.nombrehosp)
  res.status(201).json(hospital)
}

export async function updateHospitalController(req: Request, res: Response): Promise<void> {
  const parsedParams = idSchema.safeParse(req.params)
  const parsedBody = hospitalSchema.pick({ nombrehosp: true }).safeParse(req.body)

  if (!parsedParams.success) {
    throw new HttpError(400, 'Datos invalidos', parsedParams.error.flatten().fieldErrors)
  }

  if (!parsedBody.success) {
    throw new HttpError(400, 'Datos invalidos', parsedBody.error.flatten().fieldErrors)
  }

  const hospital = await updateHospital(parsedParams.data.codhospital, parsedBody.data.nombrehosp)

  if (!hospital) {
    throw new HttpError(404, 'Hospital no encontrado')
  }

  res.json(hospital)
}

export async function deleteHospitalController(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const deleted = await deleteHospital(parsed.data.codhospital)

  if (!deleted) {
    throw new HttpError(404, 'Hospital no encontrado')
  }

  res.status(204).send()
}