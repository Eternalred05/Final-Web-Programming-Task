import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function TurnoFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    codunidad: '',
    numturno: '',
    cantpacientes: 1,
    pacientesatend: 0,
    codmedico: '',
  })
  const [unidades, setUnidades] = useState([])
  const [doctores, setDoctores] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unidadesRes, doctoresRes] = await Promise.all([
          api.get('/unidades'),
          api.get('/doctores'),
        ])
        setUnidades(unidadesRes.data)
        setDoctores(doctoresRes.data)
      } catch {
        setError('No se pudieron cargar unidades o doctores')
      }
    }
    fetchData()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (Number(form.pacientesatend) > Number(form.cantpacientes)) {
      setError('Los pacientes atendidos no pueden superar a los asignados')
      return
    }

    setLoading(true)
    try {
      await api.post('/turnos', {
        codunidad: Number(form.codunidad),
        numturno: Number(form.numturno),
        cantpacientes: Number(form.cantpacientes),
        pacientesatend: Number(form.pacientesatend),
        codmedico: Number(form.codmedico),
      })
      navigate('/turnos')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear el turno')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Crear Turno</h1>
          <p className="panel-subtitle">Asignar turno a unidad y médico</p>
        </div>
      </header>
      <form className="panel-body" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="codunidad">Unidad</label>
            <select
              className="form-input"
              id="codunidad"
              name="codunidad"
              required
              value={form.codunidad}
              onChange={handleChange}
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
            <label className="form-label" htmlFor="numturno">Número de Turno</label>
            <input
              className="form-input"
              id="numturno"
              name="numturno"
              type="number"
              min="1"
              required
              value={form.numturno}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="codmedico">Médico</label>
            <select
              className="form-input"
              id="codmedico"
              name="codmedico"
              required
              value={form.codmedico}
              onChange={handleChange}
            >
              <option value="">Seleccione un médico</option>
              {doctores.map((d) => (
                <option key={d.codmedico} value={d.codmedico}>
                  {d.codmedico} — {d.nombremed} ({d.especialidad})
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="cantpacientes">Pacientes asignados</label>
            <input
              className="form-input"
              id="cantpacientes"
              name="cantpacientes"
              type="number"
              min="1"
              required
              value={form.cantpacientes}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="pacientesatend">Pacientes atendidos</label>
            <input
              className="form-input"
              id="pacientesatend"
              name="pacientesatend"
              type="number"
              min="0"
              required
              value={form.pacientesatend}
              onChange={handleChange}
            />
          </div>
        </div>
        {error ? <div className="auth-error">{error}</div> : null}
        <div className="form-actions">
          <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>Cancelar</button>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </section>
  )
}