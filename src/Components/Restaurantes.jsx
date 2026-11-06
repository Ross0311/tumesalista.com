import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RESTAURANTES } from '../data/restaurantes'
import { useDatos } from '../context/DatosContext'
import RestoAvatar from './ui/RestoAvatar'

export default function Restaurantes() {
  const [tipo, setTipo] = useState('Todos')
  const { platosDe, promosVigentes } = useDatos()
  const tipos = ['Todos', ...new Set(RESTAURANTES.map((r) => r.tipo))]
  const lista = RESTAURANTES.filter((r) => tipo === 'Todos' || r.tipo === tipo)

  return (
    <div className="fade">
      <div className="hero">
        <p className="eyebrow">Restaurantes afiliados</p>
        <h1>Mira la carta <em>antes de ir.</em></h1>
        <p className="muted">Revisa platos, precios y promociones. La carta es referencial: tu pedido lo haces en el restaurante.</p>
      </div>
      <div className="filtros" role="tablist">
        {tipos.map((t) => <button key={t} className={`chip ${tipo === t ? 'is-sel' : ''}`} onClick={() => setTipo(t)}>{t}</button>)}
      </div>
      <div className="lista-restos">
        {lista.map((r) => {
          const platos = platosDe(r.id)
          const precios = platos.filter((p) => p.categoria === 'Platos de fondo').map((p) => p.precio)
          const promos = promosVigentes(r.id).length
          return (
            <article key={r.id} className="card resto-fila">
              <RestoAvatar resto={r} size={96} />
              <div className="resto-fila__info">
                <h3>{r.nombre}</h3>
                <span className="muted">{r.tipo} · {r.distrito} · {r.horario}</span>
                <p>{r.descripcion}</p>
                <div className="resto-fila__tags">
                  <span className="chip chip--sm">{platos.length} platos</span>
                  {precios.length > 0 && <span className="chip chip--sm">Fondos desde S/ {Math.min(...precios)}</span>}
                  {promos > 0 && <span className="chip chip--sm chip--promo">{promos} {promos === 1 ? 'promoción' : 'promociones'}</span>}
                </div>
              </div>
              <div className="resto-fila__acc">
                <Link to={`/restaurantes/${r.id}`} className="btn btn--ghost">Ver carta</Link>
                <Link to={`/reservar?r=${r.id}`} className="btn">Reservar</Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
