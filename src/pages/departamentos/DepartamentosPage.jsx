import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState([])
  const [hospitales, setHospitales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [deptosRes, hospsRes] = await Promise.all([
        api.get('/departamentos'),
        api.get('/hospitales'),
      ])
      setDepartamentos(deptosRes.data)
      setHospitales(hospsRes.data)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cargar la información')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Mapa codhospital -> nombrehosp
  const nombreHospital = (codhospital) => {
    const h = hospitales.find((hosp) => hosp.codhospital === codhospital)
    return h ? h.nombrehosp : `Hospital #${codhospital ?? '?'}`
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Departamentos</h1>
          <p className="panel-subtitle">Departamentos registrados</p>
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
          <Link className="btn btn-primary" to="/departamentos/nuevo">
            Añadir departamento
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
                  <th>Hospital</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {departamentos.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No hay departamentos registrados</td>
                  </tr>
                ) : (
                  departamentos.map((depto) => (
                    <tr key={depto.coddpt}>
                      <td>{depto.coddpt}</td>
                      <td>{depto.nombredpt}</td>
                      <td>{nombreHospital(depto.codhospital)}</td>
                      <td>
                        <Link
                          className="btn btn-ghost btn-sm"
                          to={`/departamentos/${depto.coddpt}/editar`}
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