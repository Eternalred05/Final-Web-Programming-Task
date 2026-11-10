import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const { data } = await api.get('/departamentos')
        setDepartamentos(data)
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar la lista de departamentos')
      } finally {
        setLoading(false)
      }
    }
    fetchDepartamentos()
  }, [])

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Departamentos</h1>
          <p className="panel-subtitle">Departamentos registrados</p>
        </div>
        <Link className="btn btn-primary" to="/departamentos/nuevo">
          Añadir departamento
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
                  <th>Hospital</th>
                </tr>
              </thead>
              <tbody>
                {departamentos.length === 0 ? (
                  <tr>
                    <td colSpan={3}>No hay departamentos registrados</td>
                  </tr>
                ) : (
                  departamentos.map((depto) => (
                    <tr key={depto.iddepartamento ?? depto.codigo}>
                      <td>{depto.codigo ?? '-'}</td>
                      <td>{depto.nombre}</td>
                      <td>{depto.idhospital ?? '-'}</td>
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
