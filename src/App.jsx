import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import LoginPage from './pages/auth/LoginPage'
import HomePage from './pages/dashboard/HomePage'
import AcercaPage from './pages/dashboard/AcercaPage'
import PacientesPage from './pages/pacientes/PacientesPage'
import PacienteFormPage from './pages/pacientes/PacienteFormPage'
import DoctoresPage from './pages/medicos/DoctoresPage'
import DoctorFormPage from './pages/medicos/DoctorFormPage'
import HospitalesPage from './pages/hospitales/HospitalesPage'
import HospitalFormPage from './pages/hospitales/HospitalFormPage'
import DepartamentosPage from './pages/departamentos/DepartamentosPage'
import DepartamentoFormPage from './pages/departamentos/DepartamentoFormPage'
import UnidadesPage from './pages/unidades/UnidadesPage'
import UnidadFormPage from './pages/unidades/UnidadFormPage'
import TurnosPage from './pages/turnos/TurnosPage'
import TurnoFormPage from './pages/turnos/TurnoFormPage'
import ConsultasPage from './pages/turnos/ConsultasPage'
import ConsultaFormPage from './pages/turnos/ConsultaFormPage'
import InformesPage from './pages/informes/InformesPage'
import ResumenProcesoPage from './pages/reportes/ResumenProcesoPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/inicio" replace />} />
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/acerca" element={<AcercaPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/pacientes/nuevo" element={<PacienteFormPage />} />
          <Route path="/doctores" element={<DoctoresPage />} />
          <Route path="/doctores/nuevo" element={<DoctorFormPage />} />
          <Route path="/hospitales" element={<HospitalesPage />} />
          <Route path="/hospitales/nuevo" element={<HospitalFormPage />} />
          <Route path="/departamentos" element={<DepartamentosPage />} />
          <Route path="/departamentos/nuevo" element={<DepartamentoFormPage />} />
          <Route path="/unidades" element={<UnidadesPage />} />
          <Route path="/unidades/nuevo" element={<UnidadFormPage />} />
          <Route path="/turnos" element={<TurnosPage />} />
          <Route path="/turnos/nuevo" element={<TurnoFormPage />} />
          <Route path="/consultas" element={<ConsultasPage />} />
          <Route path="/consultas/nueva" element={<ConsultaFormPage />} />
          <Route path="/informes" element={<InformesPage />} />
          <Route path="/resumen-proceso" element={<ResumenProcesoPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/inicio" replace />} />
    </Routes>
  )
}

export default App
