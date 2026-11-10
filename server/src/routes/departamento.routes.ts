import { Router } from 'express'
import {
  createDepartamentoController,
  deleteDepartamentoController,
  getDepartamento,
  getDepartamentos,
  updateDepartamentoController,
} from '../controllers/departamento.controller'

export const departamentoRouter = Router()

departamentoRouter.get('/', getDepartamentos)
departamentoRouter.get('/:coddpt', getDepartamento)
departamentoRouter.post('/', createDepartamentoController)
departamentoRouter.put('/:coddpt', updateDepartamentoController)
departamentoRouter.delete('/:coddpt', deleteDepartamentoController)
