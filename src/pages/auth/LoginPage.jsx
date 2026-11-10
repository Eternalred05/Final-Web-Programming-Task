import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ usuario: '', contrasena: '' })
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
      await login(form.usuario, form.contrasena)
      navigate('/inicio')
    } catch (err) {
      setError(err.response?.data?.error || 'Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title">Mi Hospital</h1>
          <p className="auth-subtitle">Inicia sesión para continuar</p>
        </header>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="usuario">
              Usuario
            </label>
            <input
              className="form-input"
              id="usuario"
              name="usuario"
              autoComplete="username"
              required
              value={form.usuario}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="contrasena">
              Contraseña
            </label>
            <input
              className="form-input"
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              required
              value={form.contrasena}
              onChange={handleChange}
            />
          </div>
          {error ? <div className="auth-error">{error}</div> : null}
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
