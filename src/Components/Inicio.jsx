import { Link } from 'react-router-dom'
import { RESTAURANTES } from '../data/restaurantes'
import { useDatos } from '../context/DatosContext'
import RestoAvatar from './ui/RestoAvatar'
import PromoCard from './carta/PromoCard'

const PASOS = [
  ['1', 'Elige el restaurante', 'Mira su carta, precios y promociones antes de decidir.'],
  ['2', 'Escoge día, hora y mesa', 'Solo verás horarios y mesas realmente disponibles.'],
  ['3', 'Confirma con tu DNI', 'Sin crear cuenta. Te llega la confirmación por correo.'],
]

export default function Inicio() {
  const { promosVigentes } = useDatos()
  const promos = RESTAURANTES.flatMap((r) => promosVigentes(r.id).map((p) => ({ ...p, resto: r })))

  return (
    <div className="fade">
      <section className="hero hero--home">
        <div>
          <p className="eyebrow">Reservas en línea · Lima</p>
          <h1>Tu mesa, lista <em>cuando llegas.</em></h1>
          <p className="muted hero__sub">Descubre restaurantes, revisa su carta y separa tu mesa en menos de un minuto.</p>
          <div className="hero__acc">
            <Link to="/reservar" className="btn">Reservar mesa</Link>
            <Link to="/restaurantes" className="btn btn--ghost">Ver cartas</Link>
          </div>
        </div>
        <div className="hero__art" aria-hidden="true">
          <div className="hero__toldo" />
          <div className="hero__ticket">
            <span className="logo__script">Mesa 2</span>
            <span>Hoy · 20:00 · 2 personas</span>
            <span className="badge badge--confirmada">Confirmada</span>
          </div>
        </div>
      </section>

      <section className="seccion">
        <h2 className="h2">¿Cómo funciona?</h2>
        <div className="pasos-home">
          {PASOS.map(([n, t, d]) => (
            <div key={n} className="card paso-home"><span className="paso-home__n">{n}</span><h3>{t}</h3><p className="muted">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="seccion">
        <div className="seccion__head"><h2 className="h2">Restaurantes</h2><Link to="/restaurantes" className="link">Ver todos →</Link></div>
        <div className="grid-restos">
          {RESTAURANTES.map((r) => (
            <Link key={r.id} to={`/restaurantes/${r.id}`} className="card resto-card">
              <RestoAvatar resto={r} size={64} />
              <div><strong>{r.nombre}</strong><span className="muted">{r.tipo} · {r.distrito}</span></div>
            </Link>
          ))}
        </div>
      </section>

      {promos.length > 0 && (
        <section className="seccion">
          <h2 className="h2">Promociones vigentes</h2>
          <div className="grid-promos">{promos.map((p) => <PromoCard key={p.id} promo={p} resto={p.resto} />)}</div>
        </section>
      )}
    </div>
  )
}
