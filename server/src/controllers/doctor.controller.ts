import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
} from '../services/doctor.service'
import { HttpError } from '../utils/httpError'

const doctorSchema = z.object({
  codmedico: z.string().trim().min(1, 'El codigo del medico es obligatorio'),
  nombremed: z.string().trim().min(1, 'El nombre del medico es obligatorio'),
  telefono: z.string().trim().nullable().optional(),
  especialidad: z.string().trim().min(1, 'La especialidad es obligatoria'),
  numlicencia: z.string().trim().min(1, 'El numero de licencia es obligatorio'),
  experiencia: z.coerce.number().int().nonnegative('La experiencia debe ser valida'),
  codunidad: z.string().trim().min(1, 'El codigo de la unidad es obligatorio'),
})

const idSchema = z.object({
  codmedico: z.string().trim().min(1, 'El codigo del medico es obligatorio'),
})

export async function getDoctors(_req: Request, res: Response): Promise<void> {
  const doctors = await getAllDoctors()
  res.json(doctors)
}

export async function getDoctor(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const doctor = await getDoctorById(parsed.data.codmedico)

  if (!doctor) {
    throw new HttpError(404, 'Doctor no encontrado')
  }

  res.json(doctor)
}

export async function createDoctorController(req: Request, res: Response): Promise<void> {
  const parsed = doctorSchema.safeParse(req.body)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const doctor = await createDoctor(
    parsed.data.codmedico,
    parsed.data.nombremed,
    parsed.data.telefono ?? null,
    parsed.data.especialidad,
    parsed.data.numlicencia,
    parsed.data.experiencia,
    parsed.data.codunidad,
  )
  res.status(201).json(doctor)
}

export async function updateDoctorController(req: Request, res: Response): Promise<void> {
  const parsedParams = idSchema.safeParse(req.params)
  const parsedBody = doctorSchema.pick({
    nombremed: true,
    telefono: true,
    especialidad: true,
    numlicencia: true,
    experiencia: true,
    codunidad: true,
  }).safeParse(req.body)

  if (!parsedParams.success) {
    throw new HttpError(400, 'Datos invalidos', parsedParams.error.flatten().fieldErrors)
  }

  if (!parsedBody.success) {
    throw new HttpError(400, 'Datos invalidos', parsedBody.error.flatten().fieldErrors)
  }

  const doctor = await updateDoctor(
    parsedParams.data.codmedico,
    parsedBody.data.nombremed,
    parsedBody.data.telefono ?? null,
    parsedBody.data.especialidad,
    parsedBody.data.numlicencia,
    parsedBody.data.experiencia,
    parsedBody.data.codunidad,
  )

  if (!doctor) {
    throw new HttpError(404, 'Doctor no encontrado')
  }

  res.json(doctor)
}

export async function deleteDoctorController(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const deleted = await deleteDoctor(parsed.data.codmedico)

  if (!deleted) {
    throw new HttpError(404, 'Doctor no encontrado')
  }

  res.status(204).send()
}
