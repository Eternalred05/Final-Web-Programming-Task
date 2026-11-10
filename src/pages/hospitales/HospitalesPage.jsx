import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function HospitalesPage() {
  const [hospitales, setHospitales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHospitales = async () => {
      try {
        const { data } = await api.get('/hospitales')
        setHospitales(data)
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar la lista de hospitales')
      } finally {
        setLoading(false)
      }
    }
    fetchHospitales()
  }, [])

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Hospitales</h1>
          <p className="panel-subtitle">Hospitales registrados</p>
        </div>
        <Link className="btn btn-primary" to="/hospitales/nuevo">
          Añadir hospital
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
                </tr>
              </thead>
              <tbody>
                {hospitales.length === 0 ? (
                  <tr>
                    <td colSpan={2}>No hay hospitales registrados</td>
                  </tr>
                ) : (
                  hospitales.map((hospital) => (
                    <tr key={hospital.idhospital ?? hospital.codigo}>
                      <td>{hospital.codigo ?? hospital.idhospital}</td>
                      <td>{hospital.nombre}</td>
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
