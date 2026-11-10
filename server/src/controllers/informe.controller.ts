import type { Request, Response } from 'express'
import { z } from 'zod'
import {
  createInforme,
  deleteInforme,
  getAllInformes,
  getInformeById,
  updateInforme,
} from '../services/informe.service'
import { HttpError } from '../utils/httpError'

const informeSchema = z.object({
  codunidad: z.string().trim().min(1, 'El codigo de la unidad es obligatorio'),
  numinforme: z.coerce.number().int().positive('El numero de informe debe ser valido'),
  fecha: z.string().trim().min(1, 'La fecha es obligatoria'),
  hora: z.string().trim().min(1, 'La hora es obligatoria'),
  pacientesatendinf: z.coerce.number().int().nonnegative('El valor debe ser valido'),
  pacientesalta: z.coerce.number().int().nonnegative('El valor debe ser valido'),
  pacientesadmit: z.coerce.number().int().nonnegative('El valor debe ser valido'),
  pacientesregist: z.coerce.number().int().nonnegative('El valor debe ser valido'),
  numturno: z.coerce.number().int().positive('El numero de turno debe ser valido'),
})

const idSchema = z.object({
  codunidad: z.string().trim().min(1, 'El codigo de la unidad es obligatorio'),
  numinforme: z.coerce.number().int().positive('El numero de informe debe ser valido'),
})

export async function getInformes(_req: Request, res: Response): Promise<void> {
  const informes = await getAllInformes()
  res.json(informes)
}

export async function getInforme(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const informe = await getInformeById(parsed.data.codunidad, parsed.data.numinforme)

  if (!informe) {
    throw new HttpError(404, 'Informe no encontrado')
  }

  res.json(informe)
}

export async function createInformeController(req: Request, res: Response): Promise<void> {
  const parsed = informeSchema.safeParse(req.body)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const informe = await createInforme(
    parsed.data.codunidad,
    parsed.data.numinforme,
    parsed.data.fecha,
    parsed.data.hora,
    parsed.data.pacientesatendinf,
    parsed.data.pacientesalta,
    parsed.data.pacientesadmit,
    parsed.data.pacientesregist,
    parsed.data.numturno,
  )
  res.status(201).json(informe)
}

export async function updateInformeController(req: Request, res: Response): Promise<void> {
  const parsedParams = idSchema.safeParse(req.params)
  const parsedBody = informeSchema.pick({
    fecha: true,
    hora: true,
    pacientesatendinf: true,
    pacientesalta: true,
    pacientesadmit: true,
    pacientesregist: true,
    numturno: true,
  }).safeParse(req.body)

  if (!parsedParams.success) {
    throw new HttpError(400, 'Datos invalidos', parsedParams.error.flatten().fieldErrors)
  }

  if (!parsedBody.success) {
    throw new HttpError(400, 'Datos invalidos', parsedBody.error.flatten().fieldErrors)
  }

  const informe = await updateInforme(
    parsedParams.data.codunidad,
    parsedParams.data.numinforme,
    parsedBody.data.fecha,
    parsedBody.data.hora,
    parsedBody.data.pacientesatendinf,
    parsedBody.data.pacientesalta,
    parsedBody.data.pacientesadmit,
    parsedBody.data.pacientesregist,
    parsedBody.data.numturno,
  )

  if (!informe) {
    throw new HttpError(404, 'Informe no encontrado')
  }

  res.json(informe)
}

export async function deleteInformeController(req: Request, res: Response): Promise<void> {
  const parsed = idSchema.safeParse(req.params)

  if (!parsed.success) {
    throw new HttpError(400, 'Datos invalidos', parsed.error.flatten().fieldErrors)
  }

  const deleted = await deleteInforme(parsed.data.codunidad, parsed.data.numinforme)

  if (!deleted) {
    throw new HttpError(404, 'Informe no encontrado')
  }

  res.status(204).send()
}
