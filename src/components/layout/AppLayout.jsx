import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/inicio', label: 'Inicio' },
  { to: '/pacientes', label: 'Pacientes' },
  { to: '/doctores', label: 'Doctores' },
  { to: '/hospitales', label: 'Hospitales' },
  { to: '/departamentos', label: 'Departamentos' },
  { to: '/unidades', label: 'Unidades' },
  { to: '/turnos', label: 'Turnos' },
  { to: '/consultas', label: 'Atender' },
  { to: '/informes', label: 'Informes' },
  { to: '/resumen-proceso', label: 'Resumen' },
  { to: '/acerca', label: 'Acerca de' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-brand-title">Mi Hospital</span>
          <span className="app-brand-subtitle">Sistema de Gestión Hospitalaria</span>
        </div>
        <nav className="app-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-user">
          <div className="app-user-info">
            <span className="app-user-name">{user?.nombre ?? user?.usuario}</span>
            <span className="app-user-role">{user?.admin ? 'Administrador' : 'Usuario'}</span>
          </div>
          <button className="app-user-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
