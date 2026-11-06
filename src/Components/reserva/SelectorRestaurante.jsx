import { RESTAURANTES } from '../../data/restaurantes'
import RestoAvatar from '../ui/RestoAvatar'

export default function SelectorRestaurante({ valor, onChange, activasHoy }) {
  return (
    <div className="restos" role="radiogroup" aria-label="Restaurante">
      {RESTAURANTES.map((r) => (
        <button key={r.id} type="button" role="radio" aria-checked={valor === r.id}
          className={`resto ${valor === r.id ? 'is-sel' : ''}`} onClick={() => onChange(r.id)}>
          <RestoAvatar resto={r} />
          <span className="resto__body">
            <strong>{r.nombre}</strong>
            <span className="muted">{r.tipo} · {r.distrito}</span>
            <span className="resto__desc">{r.descripcion}</span>
            <span className="resto__meta">{r.mesas.length} mesas · {activasHoy[r.id] || 0} {activasHoy[r.id] === 1 ? 'reserva' : 'reservas'} hoy</span>
          </span>
          {valor === r.id && <span className="resto__check" aria-hidden="true">✓</span>}
        </button>
      ))}
    </div>
  )
}
