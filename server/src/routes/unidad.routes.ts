import { Router } from 'express'
import {
  createUnidadController,
  deleteUnidadController,
  getUnidad,
  getUnidades,
  updateUnidadController,
} from '../controllers/unidad.controller'

export const unidadRouter = Router()

unidadRouter.get('/', getUnidades)
unidadRouter.get('/:codunidad', getUnidad)
unidadRouter.post('/', createUnidadController)
unidadRouter.put('/:codunidad', updateUnidadController)
unidadRouter.delete('/:codunidad', deleteUnidadController)
