import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function TurnosPage() {
  const [turnos, setTurnos] = useState([])
  const [unidades, setUnidades] = useState([])
  const [doctores, setDoctores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [turnosRes, unidadesRes, doctoresRes] = await Promise.all([
        api.get('/turnos'),
        api.get('/unidades'),
        api.get('/doctores'),
      ])
      setTurnos(turnosRes.data)
      setUnidades(unidadesRes.data)
      setDoctores(doctoresRes.data)
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

  const nombreMedico = (codmedico) => {
    const d = doctores.find((doc) => doc.codmedico === codmedico)
    return d ? d.nombremed : `Médico #${codmedico ?? '?'}`
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Listado de Turnos</h1>
          <p className="panel-subtitle">Turnos creados</p>
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
          <Link className="btn btn-primary" to="/turnos/nuevo">
            Crear turno
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
                  <th>Turno</th>
                  <th>Unidad</th>
                  <th>Médico</th>
                  <th>Asignados</th>
                  <th>Atendidos</th>
                  <th>% Éxito</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {turnos.length === 0 ? (
                  <tr>
                    <td colSpan={7}>No hay turnos registrados</td>
                  </tr>
                ) : (
                  turnos.map((turno) => {
                    const porcentaje = turno.cantpacientes > 0
                      ? Math.round((turno.pacientesatend / turno.cantpacientes) * 100)
                      : 0
                    return (
                      <tr key={`${turno.codunidad}-${turno.numturno}`}>
                        <td>{turno.numturno}</td>
                        <td>{nombreUnidad(turno.codunidad)}</td>
                        <td>{nombreMedico(turno.codmedico)}</td>
                        <td>{turno.cantpacientes}</td>
                        <td>{turno.pacientesatend}</td>
                        <td>{porcentaje}%</td>
                        <td>
                          <Link
                            className="btn btn-ghost btn-sm"
                            to={`/turnos/${turno.codunidad}/${turno.numturno}/editar`}
                          >
                            Editar
                          </Link>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  )
}