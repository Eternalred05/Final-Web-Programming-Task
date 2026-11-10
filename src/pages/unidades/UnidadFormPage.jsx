import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function UnidadFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombreunidad: '', ubicacion: '', coddpt: '' })
  const [departamentos, setDepartamentos] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const { data } = await api.get('/departamentos')
        setDepartamentos(data)
      } catch {
        setError('No se pudieron cargar los departamentos')
      }
    }
    fetchDepartamentos()
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
      await api.post('/unidades', {
        nombreunidad: form.nombreunidad,
        ubicacion: form.ubicacion,
        coddpt: Number(form.coddpt),
      })
      navigate('/unidades')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo registrar la unidad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Añadir Unidad al Sistema</h1>
          <p className="panel-subtitle">Ingrese los datos de la unidad</p>
        </div>
      </header>
      <form className="panel-body" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="nombreunidad">Nombre</label>
            <input
              className="form-input"
              id="nombreunidad"
              name="nombreunidad"
              required
              value={form.nombreunidad}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="ubicacion">Ubicación en el Hospital</label>
            <input
              className="form-input"
              id="ubicacion"
              name="ubicacion"
              required
              value={form.ubicacion}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="coddpt">Departamento</label>
            <select
              className="form-input"
              id="coddpt"
              name="coddpt"
              required
              value={form.coddpt}
              onChange={handleChange}
            >
              <option value="">Seleccione un departamento</option>
              {departamentos.map((d) => (
                <option key={d.coddpt} value={d.coddpt}>
                  {d.coddpt} — {d.nombredpt}
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