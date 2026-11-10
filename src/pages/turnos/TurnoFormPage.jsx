import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function TurnoFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    numero: '',
    idunidad: '',
    iddoctor: '',
    pacientesasignados: 1,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: name === 'pacientesasignados' ? Number(value) : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/turnos', form)
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
            <label className="form-label" htmlFor="numero">Número de Turno</label>
            <input className="form-input" id="numero" name="numero" required value={form.numero} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="idunidad">Unidad</label>
            <input className="form-input" id="idunidad" name="idunidad" placeholder="ID de unidad" required value={form.idunidad} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="iddoctor">Médico</label>
            <input className="form-input" id="iddoctor" name="iddoctor" placeholder="ID de doctor" required value={form.iddoctor} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="pacientesasignados">Pacientes a asignar</label>
            <input className="form-input" id="pacientesasignados" name="pacientesasignados" type="number" min="1" required value={form.pacientesasignados} onChange={handleChange} />
          </div>
        </div>
        {error ? <div className="auth-error">{error}</div> : null}
        <div className="form-actions">
          <button className="btn btn-ghost" type="button" onClick={() => navigate(-1)}>Cancelar</button>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </form>
    </section>
  )
}
