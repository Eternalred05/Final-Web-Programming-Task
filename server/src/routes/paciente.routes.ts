import { Router } from 'express'
import {
  getPacientes,
  getPaciente,
  createPacienteController,
  updatePacienteController,
  deletePacienteController,
  getPacientesNoAtendidos,
  atenderPacienteController,
  agregarCausaController,
} from '../controllers/paciente.controller'

export const pacienteRouter = Router()

pacienteRouter.get('/no-atendidos/:codunidad', getPacientesNoAtendidos)
pacienteRouter.post('/atender', atenderPacienteController)
pacienteRouter.post('/causa', agregarCausaController)

pacienteRouter.get('/', getPacientes)
pacienteRouter.get('/:codunidad/:numhistclinica', getPaciente)
pacienteRouter.post('/', createPacienteController)
pacienteRouter.put('/:codunidad/:numhistclinica', updatePacienteController)
pacienteRouter.delete('/:codunidad/:numhistclinica', deletePacienteController)