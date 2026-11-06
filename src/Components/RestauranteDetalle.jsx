import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getRestaurante } from '../data/restaurantes'
import { useDatos } from '../context/DatosContext'
import RestoAvatar from './ui/RestoAvatar'
import CartaMenu from './carta/CartaMenu'
import PromoCard from './carta/PromoCard'
import FichaContacto from './ui/FichaContacto'

export default function RestauranteDetalle() {
  const { id } = useParams()
  const resto = getRestaurante(id)
  const { platosDe, promosVigentes } = useDatos()
  const [tab, setTab] = useState('carta')
  if (!resto) return <Navigate to="/restaurantes" replace />
  const promos = promosVigentes(resto.id)

  return (
    <div className="fade">
      <Link to="/restaurantes" className="link volver">← Todos los restaurantes</Link>
      <section className="detalle__head card">
        <RestoAvatar resto={resto} size={110} />
        <div className="detalle__info">
          <p className="eyebrow">{resto.tipo} · {resto.distrito}</p>
          <h1 className="detalle__nombre">{resto.nombre}</h1>
          <p className="muted">{resto.descripcion} · {resto.horario}</p>
        </div>
        <Link to={`/reservar?r=${resto.id}`} className="btn detalle__cta">Reservar mesa</Link>
      </section>

      <div className="tabs-sec" role="tablist">
        {[['carta', 'Carta'], ['promos', `Promociones${promos.length ? ` (${promos.length})` : ''}`], ['contacto', 'Contacto']].map(([k, t]) => (
          <button key={k} role="tab" aria-selected={tab === k} className={`tab-sec ${tab === k ? 'is-act' : ''}`} onClick={() => setTab(k)}>{t}</button>
        ))}
      </div>

      <div className="card" key={tab}>
        {tab === 'carta' && (
          <>
            <p className="nota">La carta es referencial: aquí reservas tu mesa y el pedido lo haces en el restaurante.</p>
            <CartaMenu platos={platosDe(resto.id)} />
          </>
        )}
        {tab === 'promos' && (promos.length
          ? <div className="grid-promos">{promos.map((p) => <PromoCard key={p.id} promo={p} />)}</div>
          : <p className="vacio">No hay promociones vigentes por ahora.</p>)}
        {tab === 'contacto' && <FichaContacto resto={resto} />}
      </div>
    </div>
  )
}
