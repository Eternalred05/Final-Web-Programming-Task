import { Router } from 'express'
import {
  createPacienteController,
  deletePacienteController,
  getPaciente,
  getPacientes,
  updatePacienteController,
} from '../controllers/paciente.controller'

export const pacienteRouter = Router()

pacienteRouter.get('/', getPacientes)
pacienteRouter.get('/:codunidad/:numhistclinica', getPaciente)
pacienteRouter.post('/', createPacienteController)
pacienteRouter.put('/:codunidad/:numhistclinica', updatePacienteController)
pacienteRouter.delete('/:codunidad/:numhistclinica', deletePacienteController)
