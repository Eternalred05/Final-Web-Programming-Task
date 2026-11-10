import { useCallback, useEffect, useState } from 'react'
import api from '../../services/api'

export default function ConsultasPage() {
  const [unidades, setUnidades] = useState([])
  const [turnos, setTurnos] = useState([])
  const [pacientes, setPacientes] = useState([])

  const [codunidad, setCodunidad] = useState('')
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null)
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)

  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const { data } = await api.get('/unidades')
        setUnidades(data)
      } catch {
        setError('No se pudieron cargar las unidades')
      } finally {
        setLoading(false)
      }
    }
    fetchUnidades()
  }, [])

  const cargarTurnos = useCallback(async (idUnidad) => {
    setTurnos([])
    setTurnoSeleccionado(null)
    setPacientes([])
    setPacienteSeleccionado(null)
    if (!idUnidad) return
    try {
      const { data } = await api.get('/turnos')
      const filtrados = data.filter((t) => t.codunidad === Number(idUnidad))
      setTurnos(filtrados)
    } catch {
      setError('No se pudieron cargar los turnos')
    }
  }, [])

  const handleUnidadChange = (event) => {
    const value = event.target.value
    setCodunidad(value)
    setError('')
    setMensaje('')
    cargarTurnos(value)
  }

  const handleTurnoChange = async (event) => {
    const value = event.target.value
    setMensaje('')
    setError('')
    setPacienteSeleccionado(null)
    if (!value) {
      setTurnoSeleccionado(null)
      setPacientes([])
      return
    }
    const turno = turnos.find((t) => `${t.codunidad}-${t.numturno}` === value) ?? null
    setTurnoSeleccionado(turno)
    try {
      const { data } = await api.get(`/pacientes/no-atendidos/${turno.codunidad}`)
      setPacientes(data)
    } catch {
      setError('No se pudieron cargar los pacientes pendientes')
    }
  }

  const recargarPacientes = async () => {
    if (!turnoSeleccionado) return
    try {
      const { data } = await api.get(`/pacientes/no-atendidos/${turnoSeleccionado.codunidad}`)
      setPacientes(data)
      setPacienteSeleccionado(null)

      const { data: turnosData } = await api.get('/turnos')
      const actualizado = turnosData.find(
        (t) => t.codunidad === turnoSeleccionado.codunidad && t.numturno === turnoSeleccionado.numturno,
      )
      if (actualizado) setTurnoSeleccionado(actualizado)
      setTurnos((prev) =>
        prev.map((t) =>
          t.codunidad === turnoSeleccionado.codunidad && t.numturno === turnoSeleccionado.numturno
            ? actualizado
            : t,
        ),
      )
    } catch {
      setError('No se pudieron recargar los datos')
    }
  }

  const handleAtender = async () => {
    if (!pacienteSeleccionado || !turnoSeleccionado) return
    setError('')
    setMensaje('')
    setProcesando(true)
    try {
      const { data } = await api.post('/pacientes/atender', {
        codunidad: pacienteSeleccionado.codunidad,
        numhistclinica: pacienteSeleccionado.numhistclinica,
        numturno: turnoSeleccionado.numturno,
      })
      setMensaje(data.mensaje ?? 'Paciente atendido correctamente.')
      await recargarPacientes()
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo atender al paciente')
    } finally {
      setProcesando(false)
    }
  }

  const handleAgregarCausa = async () => {
    if (!pacienteSeleccionado) return
    const causa = window.prompt('Ingrese la causa por la que no fue atendido:')
    if (causa === null) return
    if (!causa.trim()) {
      setError('La causa no puede estar vacía')
      return
    }
    setError('')
    setMensaje('')
    setProcesando(true)
    try {
      const { data } = await api.post('/pacientes/causa', {
        codunidad: pacienteSeleccionado.codunidad,
        numhistclinica: pacienteSeleccionado.numhistclinica,
        causa: causa.trim(),
      })
      setMensaje(data.mensaje ?? 'Causa registrada correctamente.')
      await recargarPacientes()
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo registrar la causa')
    } finally {
      setProcesando(false)
    }
  }

  const puedeAccionar = pacienteSeleccionado && turnoSeleccionado && !procesando

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Atender Paciente</h1>
          <p className="panel-subtitle">Consultas y asignación de atención</p>
        </div>
      </header>

      <div className="panel-body">
        <div className="form-grid" style={{ marginBottom: '1rem' }}>
          <div className="form-field">
            <label className="form-label" htmlFor="unidad">Unidad</label>
            <select
              className="form-input"
              id="unidad"
              value={codunidad}
              onChange={handleUnidadChange}
              disabled={loading}
            >
              <option value="">Seleccione una unidad</option>
              {unidades.map((u) => (
                <option key={u.codunidad} value={u.codunidad}>
                  {u.codunidad} — {u.nombreunidad}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="turno">Turno</label>
            <select
              className="form-input"
              id="turno"
              value={turnoSeleccionado ? `${turnoSeleccionado.codunidad}-${turnoSeleccionado.numturno}` : ''}
              onChange={handleTurnoChange}
              disabled={!codunidad || turnos.length === 0}
            >
              <option value="">Seleccione un turno</option>
              {turnos.map((t) => (
                <option key={`${t.codunidad}-${t.numturno}`} value={`${t.codunidad}-${t.numturno}`}>
                  Turno #{t.numturno} — Atendidos {t.pacientesatend}/{t.cantpacientes}
                </option>
              ))}
            </select>
          </div>
        </div>

        {turnoSeleccionado ? (
          <p className="status-text">
            Atendidos: <strong>{turnoSeleccionado.pacientesatend} / {turnoSeleccionado.cantpacientes}</strong>
          </p>
        ) : null}

        {mensaje ? <div className="auth-success">{mensaje}</div> : null}
        {error ? <div className="auth-error">{error}</div> : null}

        {turnoSeleccionado ? (
          <div className="table-wrapper" style={{ marginTop: '1rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hist. Clínica</th>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Causa</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No hay pacientes pendientes en esta unidad</td>
                  </tr>
                ) : (
                  pacientes.map((p) => {
                    const seleccionado =
                      pacienteSeleccionado?.numhistclinica === p.numhistclinica &&
                      pacienteSeleccionado?.codunidad === p.codunidad
                    return (
                      <tr
                        key={`${p.codunidad}-${p.numhistclinica}`}
                        onClick={() => setPacienteSeleccionado(p)}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: seleccionado ? 'var(--selected-row, #e0f0ff)' : undefined,
                        }}
                      >
                        <td>{p.numhistclinica}</td>
                        <td>{p.nombrepac}</td>
                        <td>{p.direccion}</td>
                        <td>{p.causa ?? '-'}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="form-actions" style={{ marginTop: '1rem' }}>
          <button
            className="btn btn-ghost"
            type="button"
            onClick={handleAgregarCausa}
            disabled={!puedeAccionar}
          >
            Agregar Causa Por la que no se Atiende
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleAtender}
            disabled={!puedeAccionar}
          >
            {procesando ? 'Procesando...' : 'Atender Paciente'}
          </button>
        </div>
      </div>
    </section>
  )
}