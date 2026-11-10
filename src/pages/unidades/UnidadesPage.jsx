import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [unidadesRes, deptosRes] = await Promise.all([
        api.get('/unidades'),
        api.get('/departamentos'),
      ])
      setUnidades(unidadesRes.data)
      setDepartamentos(deptosRes.data)
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cargar la información')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const nombreDepartamento = (coddpt) => {
    const d = departamentos.find((dep) => dep.coddpt === coddpt)
    return d ? d.nombredpt : `Departamento #${coddpt ?? '?'}`
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Unidades</h1>
          <p className="panel-subtitle">Unidades médicas registradas</p>
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
          <Link className="btn btn-primary" to="/unidades/nuevo">
            Añadir unidad
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
                  <th>Ubicación</th>
                  <th>Departamento</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {unidades.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No hay unidades registradas</td>
                  </tr>
                ) : (
                  unidades.map((unidad) => (
                    <tr key={unidad.codunidad}>
                      <td>{unidad.codunidad}</td>
                      <td>{unidad.nombreunidad}</td>
                      <td>{unidad.ubicacion}</td>
                      <td>{nombreDepartamento(unidad.coddpt)}</td>
                      <td>
                        <Link
                          className="btn btn-ghost btn-sm"
                          to={`/unidades/${unidad.codunidad}/editar`}
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