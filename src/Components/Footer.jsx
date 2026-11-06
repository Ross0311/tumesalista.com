import { Link } from 'react-router-dom'
import Logo from './ui/Logo'
import { RESTAURANTES } from '../data/restaurantes'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <Logo claro />
          <p>Soluciones tecnológicas para restaurantes: reservas en línea, cartas digitales y reportes.</p>
        </div>
        <div>
          <h4>Restaurantes</h4>
          {RESTAURANTES.map((r) => <Link key={r.id} to={`/restaurantes/${r.id}`}>{r.nombre}</Link>)}
        </div>
        <div>
          <h4>tumesalista.pe</h4>
          <Link to="/reservar">Reservar mesa</Link>
          <Link to="/servicios">Servicios para restaurantes</Link>
          <Link to="/contacto">Contacto</Link>
          <Link to="/admin">Acceso restaurantes</Link>
        </div>
      </div>
      <p className="footer__copy">© 2026 tumesalista.pe · Lima, Perú</p>
    </footer>
  )
}
