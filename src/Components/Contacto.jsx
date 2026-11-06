import { useState } from 'react'
import { RESTAURANTES, getRestaurante } from '../data/restaurantes'
import RestoAvatar from './ui/RestoAvatar'
import FichaContacto from './ui/FichaContacto'

export default function Contacto() {
  const [id, setId] = useState(RESTAURANTES[0].id)
  const resto = getRestaurante(id)
  return (
    <div className="fade">
      <div className="hero">
        <p className="eyebrow">Contacto</p>
        <h1>Habla con <em>tu restaurante.</em></h1>
        <p className="muted">Cada restaurante atiende sus propias consultas: elige uno para ver sus datos o escribirle.</p>
      </div>
      <div className="contacto-sel">
        {RESTAURANTES.map((r) => (
          <button key={r.id} className={`contacto-op ${id === r.id ? 'is-sel' : ''}`} onClick={() => setId(r.id)}>
            <RestoAvatar resto={r} size={40} /><span>{r.nombre}<small className="muted">{r.distrito}</small></span>
          </button>
        ))}
      </div>
      <div className="card" key={id}><FichaContacto resto={resto} /></div>
    </div>
  )
}
