import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function PacienteFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    historiaclinica: '',
    fechanacimiento: '',
    idunidad: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/pacientes', form)
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
            <label className="form-label" htmlFor="nombre">
              Nombre
            </label>
            <input className="form-input" id="nombre" name="nombre" required value={form.nombre} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="direccion">
              Dirección
            </label>
            <input className="form-input" id="direccion" name="direccion" required value={form.direccion} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="historiaclinica">
              Número de Historia Clínica
            </label>
            <input className="form-input" id="historiaclinica" name="historiaclinica" required value={form.historiaclinica} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="fechanacimiento">
              Fecha de nacimiento
            </label>
            <input className="form-input" id="fechanacimiento" name="fechanacimiento" type="date" required value={form.fechanacimiento} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="idunidad">
              Unidad
            </label>
            <input className="form-input" id="idunidad" name="idunidad" placeholder="ID de unidad" required value={form.idunidad} onChange={handleChange} />
          </div>
        </div>
        {error ? <div className="auth-error">{error}</div> : null}
        <div className="form-actions">
          <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>
            Cancelar
          </button>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Añadir'}
          </button>
        </div>
      </form>
    </section>
  )
}
