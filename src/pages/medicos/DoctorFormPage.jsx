import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function DoctorFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    especialidad: '',
    licencia: '',
    idunidad: '',
    experiencia: 0,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: name === 'experiencia' ? Number(value) : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/doctores', form)
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
            <label className="form-label" htmlFor="nombre">Nombre</label>
            <input className="form-input" id="nombre" name="nombre" required value={form.nombre} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="telefono">Teléfono</label>
            <input className="form-input" id="telefono" name="telefono" required value={form.telefono} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="especialidad">Especialidad</label>
            <input className="form-input" id="especialidad" name="especialidad" required value={form.especialidad} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="licencia">Número de Licencia</label>
            <input className="form-input" id="licencia" name="licencia" required value={form.licencia} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="idunidad">Unidad</label>
            <input className="form-input" id="idunidad" name="idunidad" placeholder="ID de unidad" required value={form.idunidad} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="experiencia">Años de experiencia</label>
            <input className="form-input" id="experiencia" name="experiencia" type="number" min="0" required value={form.experiencia} onChange={handleChange} />
          </div>
        </div>
        {error ? <div className="auth-error">{error}</div> : null}
        <div className="form-actions">
          <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>Cancelar</button>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Añadir'}</button>
        </div>
      </form>
    </section>
  )
}
