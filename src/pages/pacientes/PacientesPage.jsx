import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const { data } = await api.get('/pacientes')
        setPacientes(data)
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar la lista de pacientes')
      } finally {
        setLoading(false)
      }
    }
    fetchPacientes()
  }, [])

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Pacientes</h1>
          <p className="panel-subtitle">Pacientes registrados en el sistema</p>
        </div>
        <Link className="btn btn-primary" to="/pacientes/nuevo">
          Añadir paciente
        </Link>
      </header>
      <div className="panel-body">
        {loading ? <p className="status-text">Cargando...</p> : null}
        {error ? <div className="auth-error">{error}</div> : null}
        {!loading && !error ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nº Hist. Clínica</th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Fecha Nac.</th>
                  <th>Unidad</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No hay pacientes registrados</td>
                  </tr>
                ) : (
                  pacientes.map((paciente) => (
                    <tr key={paciente.idpaciente ?? paciente.historiaclinica}>
                      <td>{paciente.historiaclinica ?? paciente.numero_historia ?? '-'}</td>
                      <td>{paciente.nombre}</td>
                      <td>{paciente.direccion ?? '-'}</td>
                      <td>{paciente.fechanacimiento ? new Date(paciente.fechanacimiento).toLocaleDateString() : '-'}</td>
                      <td>{paciente.unidad ?? paciente.idunidad ?? '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  )
}
