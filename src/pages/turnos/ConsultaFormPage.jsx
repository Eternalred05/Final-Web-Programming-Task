import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function ConsultaFormPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    idpaciente: '',
    idturno: '',
    idunidad: '',
    iddoctor: '',
    fecha: '',
    estado: 'en_espera',
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
      await api.post('/consultas', form)
      navigate('/consultas')
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear la consulta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-panel">
      <header className="panel-header">
        <div className="panel-title-group">
          <h1 className="panel-title">Nueva Consulta</h1>
          <p className="panel-subtitle">Generar consulta para atender paciente</p>
        </div>
      </header>
      <form className="panel-body" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="idpaciente">Paciente</label>
            <input className="form-input" id="idpaciente" name="idpaciente" placeholder="ID de paciente" required value={form.idpaciente} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="idturno">Turno</label>
            <input className="form-input" id="idturno" name="idturno" placeholder="ID de turno" required value={form.idturno} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="idunidad">Unidad</label>
            <input className="form-input" id="idunidad" name="idunidad" placeholder="ID de unidad" required value={form.idunidad} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="iddoctor">Doctor</label>
            <input className="form-input" id="iddoctor" name="iddoctor" placeholder="ID de doctor" required value={form.iddoctor} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="fecha">Fecha</label>
            <input className="form-input" id="fecha" name="fecha" type="datetime-local" required value={form.fecha} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="estado">Estado</label>
            <select className="form-select" id="estado" name="estado" value={form.estado} onChange={handleChange}>
              <option value="en_espera">En espera</option>
              <option value="atendida">Atendida</option>
              <option value="cancelada">Cancelada</option>
            </select>
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
