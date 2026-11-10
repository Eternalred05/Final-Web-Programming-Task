import { Router } from 'express'
import {
  createTurnoController,
  deleteTurnoController,
  getTurno,
  getTurnos,
  updateTurnoController,
} from '../controllers/turno.controller'

export const turnoRouter = Router()

turnoRouter.get('/', getTurnos)
turnoRouter.get('/:codunidad/:numturno', getTurno)
turnoRouter.post('/', createTurnoController)
turnoRouter.put('/:codunidad/:numturno', updateTurnoController)
turnoRouter.delete('/:codunidad/:numturno', deleteTurnoController)
