import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function DoctorFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombremed: '',
    telefono: '',
    especialidad: '',
    numlicencia: '',
    experiencia: '',
    codunidad: '',
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
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/doctores', {
        nombremed: form.nombremed,
        telefono: form.telefono.trim(),
        especialidad: form.especialidad,
        numlicencia: form.numlicencia,
        experiencia: Number(form.experiencia),
        codunidad: Number(form.codunidad),
      })
      navigate('/doctores')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo registrar el doctor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Añadir Doctor al Sistema</h1>
          <p className="panel-subtitle">Ingrese los datos del doctor</p>
        </div>
      </header>
      <form className="panel-body" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="nombremed">Nombre</label>
            <input
              className="form-input"
              id="nombremed"
              name="nombremed"
              required
              value={form.nombremed}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="telefono">Teléfono</label>
            <input
              className="form-input"
              id="telefono"
              name="telefono"
              type="tel"
              required
              value={form.telefono}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="especialidad">Especialidad</label>
            <input
              className="form-input"
              id="especialidad"
              name="especialidad"
              required
              value={form.especialidad}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="numlicencia">Número de Licencia</label>
            <input
              className="form-input"
              id="numlicencia"
              name="numlicencia"
              required
              value={form.numlicencia}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="experiencia">Años de experiencia</label>
            <input
              className="form-input"
              id="experiencia"
              name="experiencia"
              type="number"
              min="0"
              required
              value={form.experiencia}
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