import { Router } from 'express'
import {
  createDoctorController,
  deleteDoctorController,
  getDoctor,
  getDoctors,
  updateDoctorController,
} from '../controllers/doctor.controller'

export const doctorRouter = Router()

doctorRouter.get('/', getDoctors)
doctorRouter.get('/:codmedico', getDoctor)
doctorRouter.post('/', createDoctorController)
doctorRouter.put('/:codmedico', updateDoctorController)
doctorRouter.delete('/:codmedico', deleteDoctorController)
