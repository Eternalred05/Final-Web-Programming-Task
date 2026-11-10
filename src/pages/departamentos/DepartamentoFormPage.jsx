import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function DepartamentoFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombredpt: '', codhospital: '' })
  const [hospitales, setHospitales] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchHospitales = async () => {
      try {
        const { data } = await api.get('/hospitales')
        setHospitales(data)
      } catch {
        setError('No se pudieron cargar los hospitales')
      }
    }
    fetchHospitales()
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
      await api.post('/departamentos', {
        nombredpt: form.nombredpt,
        codhospital: Number(form.codhospital),
      })
      navigate('/departamentos')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo registrar el departamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Añadir Departamento al Sistema</h1>
          <p className="panel-subtitle">Ingrese los datos del departamento</p>
        </div>
      </header>
      <form className="panel-body" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="nombredpt">Nombre</label>
            <input
              className="form-input"
              id="nombredpt"
              name="nombredpt"
              required
              value={form.nombredpt}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="codhospital">Hospital</label>
            <select
              className="form-input"
              id="codhospital"
              name="codhospital"
              required
              value={form.codhospital}
              onChange={handleChange}
            >
              <option value="">Seleccione un hospital</option>
              {hospitales.map((h) => (
                <option key={h.codhospital} value={h.codhospital}>
                  {h.codhospital} — {h.nombrehosp}
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