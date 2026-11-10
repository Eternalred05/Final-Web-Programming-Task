import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function UnidadFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', ubicacion: '', codigo: '', iddepartamento: '' })
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
      await api.post('/unidades', form)
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
            <label className="form-label" htmlFor="nombre">Nombre</label>
            <input className="form-input" id="nombre" name="nombre" required value={form.nombre} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="ubicacion">Ubicación en el Hospital</label>
            <input className="form-input" id="ubicacion" name="ubicacion" required value={form.ubicacion} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="codigo">Identificador</label>
            <input className="form-input" id="codigo" name="codigo" required value={form.codigo} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="iddepartamento">Departamento</label>
            <input className="form-input" id="iddepartamento" name="iddepartamento" placeholder="ID de departamento" required value={form.iddepartamento} onChange={handleChange} />
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
