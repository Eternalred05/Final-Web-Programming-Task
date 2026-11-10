import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function DoctoresPage() {
  const [doctores, setDoctores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDoctores = async () => {
      try {
        const { data } = await api.get('/doctores')
        setDoctores(data)
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar la lista de doctores')
      } finally {
        setLoading(false)
      }
    }
    fetchDoctores()
  }, [])

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Doctores</h1>
          <p className="panel-subtitle">Médicos registrados</p>
        </div>
        <Link className="btn btn-primary" to="/doctores/nuevo">
          Añadir doctor
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
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  <th>Licencia</th>
                  <th>Teléfono</th>
                  <th>Años de experiencia</th>
                </tr>
              </thead>
              <tbody>
                {doctores.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No hay doctores registrados</td>
                  </tr>
                ) : (
                  doctores.map((doctor) => (
                    <tr key={doctor.iddoctor ?? doctor.licencia}>
                      <td>{doctor.nombre}</td>
                      <td>{doctor.especialidad}</td>
                      <td>{doctor.licencia}</td>
                      <td>{doctor.telefono ?? '-'}</td>
                      <td>{doctor.experiencia ?? '-'}</td>
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
