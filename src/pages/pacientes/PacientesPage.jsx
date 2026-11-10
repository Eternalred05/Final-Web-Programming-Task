import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([])
  const [unidades, setUnidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [pacientesRes, unidadesRes] = await Promise.all([
        api.get('/pacientes'),
        api.get('/unidades'),
      ])
      setPacientes(pacientesRes.data)
      setUnidades(unidadesRes.data)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cargar la información')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const nombreUnidad = (codunidad) => {
    const u = unidades.find((uni) => uni.codunidad === codunidad)
    return u ? u.nombreunidad : `Unidad #${codunidad ?? '?'}`
  }

  // Formatea YYYY-MM-DD sin problemas de timezone
  const formatearFecha = (fecha) => {
    if (!fecha) return '-'
    const iso = typeof fecha === 'string' ? fecha : fecha.toISOString()
    const [y, m, d] = iso.split('T')[0].split('-')
    return `${d}/${m}/${y}`
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Pacientes</h1>
          <p className="panel-subtitle">Pacientes registrados en el sistema</p>
        </div>
        <div className="panel-actions">
          <button
            className="btn btn-ghost"
            type="button"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Recargar'}
          </button>
          <Link className="btn btn-primary" to="/pacientes/nuevo">
            Añadir paciente
          </Link>
        </div>
      </header>
      <div className="panel-body">
        {error ? <div className="auth-error">{error}</div> : null}
        {loading ? (
          <p className="status-text">Cargando...</p>
        ) : !error ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nº Hist. Clínica</th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Fecha Nac.</th>
                  <th>Unidad</th>
                  <th>Atendido</th>
                  <th>Causa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.length === 0 ? (
                  <tr>
                    <td colSpan={8}>No hay pacientes registrados</td>
                  </tr>
                ) : (
                  pacientes.map((paciente) => (
                    <tr key={`${paciente.codunidad}-${paciente.numhistclinica}`}>
                      <td>{paciente.numhistclinica}</td>
                      <td>{paciente.nombrepac}</td>
                      <td>{paciente.direccion}</td>
                      <td>{formatearFecha(paciente.nacimiento)}</td>
                      <td>{nombreUnidad(paciente.codunidad)}</td>
                      <td>{paciente.atendido ? 'Sí' : 'No'}</td>
                      <td>{paciente.causa ?? '-'}</td>
                      <td>
                        <Link
                          className="btn btn-ghost btn-sm"
                          to={`/pacientes/${paciente.codunidad}/${paciente.numhistclinica}/editar`}
                        >
                          Editar
                        </Link>
                      </td>
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