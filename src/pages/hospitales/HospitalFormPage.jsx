import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function HospitalFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', codigo: '' })
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
      await api.post('/hospitales', form)
      navigate('/hospitales')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo registrar el hospital')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Añadir Hospital al Sistema</h1>
          <p className="panel-subtitle">Ingrese los datos del hospital</p>
        </div>
      </header>
      <form className="panel-body" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="nombre">Nombre</label>
            <input className="form-input" id="nombre" name="nombre" required value={form.nombre} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="codigo">Identificador / Código</label>
            <input className="form-input" id="codigo" name="codigo" required value={form.codigo} onChange={handleChange} />
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
