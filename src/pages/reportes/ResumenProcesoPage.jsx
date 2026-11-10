import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ResumenProcesoPage() {
  const [resumen, setResumen] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const { data } = await api.get('/resumen/proceso')
        setResumen(data)
      } catch (err) {
        try {
          const { data } = await api.get('/informes/resumen')
          setResumen(data)
        } catch (err2) {
          setError(err2.response?.data?.error || 'No se pudo cargar el resumen del proceso')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchResumen()
  }, [])

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Resumen del Proceso</h1>
          <p className="panel-subtitle">Resumen general por unidad y turno</p>
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
                  <th>Pacientes inicio</th>
                  <th>Atendidos</th>
                  <th>Total</th>
                  <th>% Atendidos</th>
                  <th>Altas</th>
                  <th>Admitidos</th>
                </tr>
              </thead>
              <tbody>
                {resumen.length === 0 ? (
                  <tr>
                    <td colSpan={8}>Sin datos disponibles</td>
                  </tr>
                ) : (
                  resumen.map((item, index) => (
                    <tr key={index}>
                      <td>{item.idunidad ?? item.unidad ?? '-'}</td>
                      <td>{item.idturno ?? item.turno ?? '-'}</td>
                      <td>{item.pacientesinicio ?? '-'}</td>
                      <td>{item.atendidos ?? 0}</td>
                      <td>{item.totalregistro ?? item.total ?? '-'}</td>
                      <td>{item.porcentaje_atendidos ?? item.porcentaje ?? '-'}</td>
                      <td>{item.altas ?? 0}</td>
                      <td>{item.admitidos ?? 0}</td>
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
