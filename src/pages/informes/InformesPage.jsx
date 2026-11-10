import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function InformesPage() {
  const [informes, setInformes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchInformes = async () => {
      try {
        const { data } = await api.get('/informes')
        setInformes(data)
      } catch (err) {
        setError(err.response?.data?.error || 'No se pudieron cargar los informes')
      } finally {
        setLoading(false)
      }
    }
    fetchInformes()
  }, [])

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Reporte de Informes</h1>
          <p className="panel-subtitle">Informes generados por unidad y turno</p>
        </div>
      </header>
      <div className="panel-body">
        {loading ? <p className="status-text">Cargando...</p> : null}
        {error ? <div className="auth-error">{error}</div> : null}
        {!loading && !error ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Unidad</th>
                  <th>Turno</th>
                  <th>Fecha</th>
                  <th>Pacientes inicio</th>
                  <th>Admitidos</th>
                  <th>Altas</th>
                  <th>Atendidos</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {informes.length === 0 ? (
                  <tr>
                    <td colSpan={8}>No hay informes registrados</td>
                  </tr>
                ) : (
                  informes.map((informe) => (
                    <tr key={informe.idinforme ?? `${informe.idunidad}-${informe.idturno}`}>
                      <td>{informe.idunidad ?? '-'}</td>
                      <td>{informe.idturno ?? '-'}</td>
                      <td>{informe.fecha ? new Date(informe.fecha).toLocaleString() : '-'}</td>
                      <td>{informe.pacientesinicio ?? '-'}</td>
                      <td>{informe.admitidos ?? 0}</td>
                      <td>{informe.altas ?? 0}</td>
                      <td>{informe.atendidos ?? 0}</td>
                      <td>{informe.totalregistro ?? '-'}</td>
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
