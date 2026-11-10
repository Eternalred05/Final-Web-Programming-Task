import { Router } from 'express'
import {
  createHospitalController,
  deleteHospitalController,
  getHospital,
  getHospitals,
  updateHospitalController,
} from '../controllers/hospital.controller'

export const hospitalRouter = Router()

hospitalRouter.get('/', getHospitals)
hospitalRouter.get('/:codhospital', getHospital)
hospitalRouter.post('/', createHospitalController)
hospitalRouter.put('/:codhospital', updateHospitalController)
hospitalRouter.delete('/:codhospital', deleteHospitalController)
