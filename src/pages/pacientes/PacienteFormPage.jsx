import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function PacienteFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombrepac: '',
    direccion: '',
    numhistclinica: '',
    nacimiento: '',
    codunidad: '',
    atendido: false,
    causa: '',
  })
  const [unidades, setUnidades] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const { data } = await api.get('/unidades')
        setUnidades(data)
      } catch {
        setError('No se pudieron cargar las unidades')
      }
    }
    fetchUnidades()
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/pacientes', {
        nombrepac: form.nombrepac,
        direccion: form.direccion,
        numhistclinica: form.numhistclinica,
        nacimiento: form.nacimiento,
        codunidad: Number(form.codunidad),
        atendido: form.atendido,
        causa: form.atendido ? null : (form.causa.trim() || null),
      })
      navigate('/pacientes')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo registrar el paciente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Añadir Paciente al Sistema</h1>
          <p className="panel-subtitle">Ingrese los datos del paciente</p>
        </div>
      </header>
      <form className="panel-body" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="nombrepac">Nombre</label>
            <input
              className="form-input"
              id="nombrepac"
              name="nombrepac"
              required
              value={form.nombrepac}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="direccion">Dirección</label>
            <input
              className="form-input"
              id="direccion"
              name="direccion"
              required
              value={form.direccion}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="numhistclinica">Número de Historia Clínica</label>
            <input
              className="form-input"
              id="numhistclinica"
              name="numhistclinica"
              required
              value={form.numhistclinica}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="nacimiento">Fecha de nacimiento</label>
            <input
              className="form-input"
              id="nacimiento"
              name="nacimiento"
              type="date"
              required
              value={form.nacimiento}
              onChange={handleChange}
            />
          </div>
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
            <label className="form-label" htmlFor="atendido">
              <input
                type="checkbox"
                id="atendido"
                name="atendido"
                checked={form.atendido}
                onChange={handleChange}
              />{' '}
              Paciente atendido
            </label>
          </div>
          {!form.atendido ? (
            <div className="form-field">
              <label className="form-label" htmlFor="causa">Causa (opcional)</label>
              <input
                className="form-input"
                id="causa"
                name="causa"
                value={form.causa}
                onChange={handleChange}
              />
            </div>
          ) : null}
        </div>
        {error ? <div className="auth-error">{error}</div> : null}
        <div className="form-actions">
          <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>Cancelar</button>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Añadir'}
          </button>
        </div>
      </form>
    </section>
  )
}