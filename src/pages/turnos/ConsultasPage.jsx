import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const { data } = await api.get('/consultas')
        setConsultas(data)
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudieron cargar las consultas')
      } finally {
        setLoading(false)
      }
    }
    fetchConsultas()
  }, [])

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Atender Paciente</h1>
          <p className="panel-subtitle">Consultas y asignación de atención</p>
        </div>
        <Link className="btn btn-primary" to="/consultas/nueva">
          Nueva consulta
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
                  <th>Paciente</th>
                  <th>Turno</th>
                  <th>Unidad</th>
                  <th>Doctor</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {consultas.length === 0 ? (
                  <tr>
                    <td colSpan={6}>No hay consultas registradas</td>
                  </tr>
                ) : (
                  consultas.map((consulta) => (
                    <tr key={consulta.idconsulta ?? `${consulta.idpaciente}-${consulta.idturno}`}>
                      <td>{consulta.idpaciente ?? '-'}</td>
                      <td>{consulta.idturno ?? '-'}</td>
                      <td>{consulta.idunidad ?? '-'}</td>
                      <td>{consulta.iddoctor ?? '-'}</td>
                      <td>{consulta.fecha ? new Date(consulta.fecha).toLocaleString() : '-'}</td>
                      <td>{consulta.estado ?? '-'}</td>
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
