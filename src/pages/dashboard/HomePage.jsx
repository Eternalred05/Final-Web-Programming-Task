import { Link } from 'react-router-dom'

const cards = [
  { to: '/pacientes/nuevo', title: 'Agregar Paciente', text: 'Registrar un nuevo paciente en el sistema.' },
  { to: '/consultas', title: 'Atender Paciente', text: 'Crear una nueva consulta médica.' },
  { to: '/pacientes', title: 'Listado de Pacientes', text: 'Ver todos los pacientes registrados.' },
  { to: '/resumen-proceso', title: 'Resumen del Proceso', text: 'Consultar el resumen general del proceso.' },
]

export default function HomePage() {
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Bienvenido a Mi Hospital</h1>
        <p className="page-subtitle">Sistema de gestión hospitalaria</p>
      </header>
      <section className="page-grid">
        {cards.map((card) => (
          <Link key={card.to} to={card.to} className="page-card">
            <h2 className="page-card-title">{card.title}</h2>
            <p className="page-card-text">{card.text}</p>
          </Link>
        ))}
      </section>
    </>
  )
}
