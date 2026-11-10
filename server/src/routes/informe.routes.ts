import { Router } from 'express'
import {
  createInformeController,
  deleteInformeController,
  getInforme,
  getInformes,
  updateInformeController,
} from '../controllers/informe.controller'

export const informeRouter = Router()

informeRouter.get('/', getInformes)
informeRouter.get('/:codunidad/:numinforme', getInforme)
informeRouter.post('/', createInformeController)
informeRouter.put('/:codunidad/:numinforme', updateInformeController)
informeRouter.delete('/:codunidad/:numinforme', deleteInformeController)
