import { Link } from 'react-router-dom'

export default function AcercaPage() {
  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Acerca de</h1>
        <p className="page-subtitle">Información del sistema</p>
      </header>
      <section className="page-grid">
        <article className="page-card">
          <h2 className="page-card-title">Mi Hospital</h2>
          <p className="page-card-text">Sistema de gestión hospitalaria para administrar hospitales, departamentos, unidades, doctores, pacientes y turnos.</p>
        </article>
        <article className="page-card">
          <h2 className="page-card-title">Versión</h2>
          <p className="page-card-text">1.0.0</p>
        </article>
        <article className="page-card">
          <h2 className="page-card-title">Desarrollado por</h2>
          <p className="page-card-text">Equipo de desarrollo de Mi Hospital.</p>
        </article>
        <article className="page-card">
          <h2 className="page-card-title">Contacto</h2>
          <p className="page-card-text">soporte@mihospital.com</p>
        </article>
      </section>
    </>
  )
}
