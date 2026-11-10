import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function DoctoresPage() {
  const [doctores, setDoctores] = useState([])
  const [unidades, setUnidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [doctoresRes, unidadesRes] = await Promise.all([
        api.get('/doctores'),
        api.get('/unidades'),
      ])
      setDoctores(doctoresRes.data)
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

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Doctores</h1>
          <p className="panel-subtitle">Médicos registrados</p>
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
          <Link className="btn btn-primary" to="/doctores/nuevo">
            Añadir doctor
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
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  <th>Licencia</th>
                  <th>Teléfono</th>
                  <th>Experiencia</th>
                  <th>Unidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {doctores.length === 0 ? (
                  <tr>
                    <td colSpan={8}>No hay doctores registrados</td>
                  </tr>
                ) : (
                  doctores.map((doctor) => (
                    <tr key={doctor.codmedico}>
                      <td>{doctor.codmedico}</td>
                      <td>{doctor.nombremed}</td>
                      <td>{doctor.especialidad}</td>
                      <td>{doctor.numlicencia}</td>
                      <td>{doctor.telefono ?? '-'}</td>
                      <td>{doctor.experiencia}</td>
                      <td>{nombreUnidad(doctor.codunidad)}</td>
                      <td>
                        <Link
                          className="btn btn-ghost btn-sm"
                          to={`/doctores/${doctor.codmedico}/editar`}
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