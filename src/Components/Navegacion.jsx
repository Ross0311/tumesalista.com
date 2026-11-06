import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from './ui/Logo'
import { useDatos } from '../context/DatosContext'

const ENLACES = [['/', 'Inicio'], ['/restaurantes', 'Restaurantes y cartas'], ['/servicios', 'Servicios'], ['/contacto', 'Contacto']]

export default function Navegacion() {
  const [abierto, setAbierto] = useState(false)
  const { admin } = useDatos()
  const { pathname } = useLocation()

  // Cierra el menú móvil al cambiar de página
  useEffect(() => { setAbierto(false); window.scrollTo(0, 0) }, [pathname])

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" aria-label="Inicio"><Logo claro /></Link>
        <button className="burger" onClick={() => setAbierto(!abierto)} aria-expanded={abierto} aria-label="Menú">
          <span /><span /><span />
        </button>
        <nav className={`nav ${abierto ? 'nav--abierto' : ''}`}>
          {ENLACES.map(([to, txt]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `nav__link ${isActive ? 'is-act' : ''}`}>{txt}</NavLink>
          ))}
          <NavLink to="/admin" className={({ isActive }) => `nav__link nav__admin ${isActive ? 'is-act' : ''}`}>
            {admin ? <><span className="usuario__av usuario__av--sm">{admin.nombre.split(' ').map((p) => p[0]).join('')}</span>Mi restaurante</> : 'Acceso restaurantes'}
          </NavLink>
          <NavLink to="/reservar" className="btn btn--butter nav__cta">Reservar mesa</NavLink>
        </nav>
      </div>
      <div className="toldo" aria-hidden="true" />
    </header>
  )
}
