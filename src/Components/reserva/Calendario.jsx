import { useState, useEffect } from 'react'
import { isoDia, hoyISO } from '../../utils/fechas'

const DIAS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// Calendario mensual reutilizable. `conteo` = { 'YYYY-MM-DD': n } para marcar días con reservas.
export default function Calendario({ seleccion, onSelect, conteo = {}, bloquearPasado = false }) {
  const [mes, setMes] = useState(() => new Date(seleccion + 'T12:00'))

  // Si la fecha seleccionada cambia de mes desde fuera, el calendario la sigue
  useEffect(() => {
    const s = new Date(seleccion + 'T12:00')
    if (s.getMonth() !== mes.getMonth() || s.getFullYear() !== mes.getFullYear()) setMes(s)
  }, [seleccion]) // eslint-disable-line react-hooks/exhaustive-deps

  const año = mes.getFullYear(), m = mes.getMonth()
  const offset = (new Date(año, m, 1).getDay() + 6) % 7
  const totalDias = new Date(año, m + 1, 0).getDate()
  const celdas = [...Array(offset).fill(null), ...Array.from({ length: totalDias }, (_, i) => i + 1)]
  const hoy = hoyISO()
  const mover = (d) => setMes(new Date(año, m + d, 1))

  return (
    <div className="cal">
      <div className="cal__top">
        <button className="icon-btn" onClick={() => mover(-1)} aria-label="Mes anterior">‹</button>
        <strong className="cal__mes">{(t => t[0].toUpperCase() + t.slice(1))(mes.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' }))}</strong>
        <button className="icon-btn" onClick={() => mover(1)} aria-label="Mes siguiente">›</button>
      </div>
      <div className="cal__grid">
        {DIAS.map((d, i) => <span key={i} className="cal__dow">{d}</span>)}
        {celdas.map((d, i) => {
          if (!d) return <span key={i} />
          const iso = isoDia(new Date(año, m, d))
          const pasado = bloquearPasado && iso < hoy
          const n = conteo[iso] || 0
          return (
            <button key={i} disabled={pasado} onClick={() => onSelect(iso)}
              className={`cal__dia ${iso === seleccion ? 'is-sel' : ''} ${iso === hoy ? 'is-hoy' : ''}`}
              aria-label={`${d}${n ? `, ${n} reservas` : ''}`} aria-pressed={iso === seleccion}>
              {d}
              {n > 0 && <span className="cal__punto">{n}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
