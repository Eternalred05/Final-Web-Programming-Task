import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function TurnosPage() {
  const [turnos, setTurnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const { data } = await api.get('/turnos')
        setTurnos(data)
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudo cargar la lista de turnos')
      } finally {
        setLoading(false)
      }
    }
    fetchTurnos()
  }, [])

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Turnos</h1>
          <p className="panel-subtitle">Turnos creados</p>
        </div>
        <Link className="btn btn-primary" to="/turnos/nuevo">
          Crear turno
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
                  <th>Turno</th>
                  <th>Unidad</th>
                  <th>Médico</th>
                  <th>Pacientes asignados</th>
                  <th>Pacientes atendidos</th>
                </tr>
              </thead>
              <tbody>
                {turnos.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No hay turnos registrados</td>
                  </tr>
                ) : (
                  turnos.map((turno) => (
                    <tr key={turno.idturno ?? turno.numero}>
                      <td>{turno.numero ?? turno.idturno}</td>
                      <td>{turno.idunidad ?? '-'}</td>
                      <td>{turno.iddoctor ?? '-'}</td>
                      <td>{turno.pacientesasignados ?? '-'}</td>
                      <td>{turno.pacientesatendidos ?? 0}</td>
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
