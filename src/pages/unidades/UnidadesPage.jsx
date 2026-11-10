import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function UnidadesPage() {
  const [unidades, setUnidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const { data } = await api.get('/unidades')
        setUnidades(data)
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar la lista de unidades')
      } finally {
        setLoading(false)
      }
    }
    fetchUnidades()
  }, [])

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Unidades</h1>
          <p className="panel-subtitle">Unidades médicas registradas</p>
        </div>
        <Link className="btn btn-primary" to="/unidades/nuevo">
          Añadir unidad
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
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Ubicación</th>
                  <th>Departamento</th>
                </tr>
              </thead>
              <tbody>
                {unidades.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No hay unidades registrados</td>
                  </tr>
                ) : (
                  unidades.map((unidad) => (
                    <tr key={unidad.idunidad ?? unidad.codigo}>
                      <td>{unidad.codigo ?? '-'}</td>
                      <td>{unidad.nombre}</td>
                      <td>{unidad.ubicacion ?? '-'}</td>
                      <td>{unidad.iddepartamento ?? '-'}</td>
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
