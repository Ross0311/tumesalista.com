import { formatoCorto, hoyISO } from '../../utils/fechas'

export default function PromoCard({ promo, resto, acciones }) {
  const vencida = promo.hasta < hoyISO()
  return (
    <article className={`promo ${!promo.activa || vencida ? 'promo--off' : ''}`}>
      <span className="promo__tag">{promo.etiqueta}</span>
      <div className="promo__body">
        {resto && <span className="promo__resto">{resto.nombre}</span>}
        <h4>{promo.titulo}</h4>
        <p>{promo.descripcion}</p>
        <span className="muted promo__vig">{promo.dias} · hasta el {formatoCorto(promo.hasta)}
          {vencida ? ' · Vencida' : !promo.activa ? ' · Pausada' : ''}</span>
        {acciones && <div className="promo__acc">{acciones}</div>}
      </div>
    </article>
  )
}
