import { HORARIOS } from '../../data/restaurantes'

// Botones de horario; marca como "lleno" los turnos sin mesas libres para el grupo
export default function SelectorHorario({ valor, onChange, libresPorHora }) {
  return (
    <div className="horas" role="radiogroup" aria-label="Horario">
      {HORARIOS.map((h) => {
        const libres = libresPorHora[h] ?? 0
        const lleno = libres === 0
        return (
          <button key={h} type="button" role="radio" aria-checked={valor === h} disabled={lleno}
            className={`hora ${valor === h ? 'is-sel' : ''} ${libres > 0 && libres <= 2 ? 'is-pocas' : ''}`}
            onClick={() => onChange(h)} title={lleno ? 'Sin mesas' : `${libres} mesas libres`}>
            {h}
          </button>
        )
      })}
    </div>
  )
}
