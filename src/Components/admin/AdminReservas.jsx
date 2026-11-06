import { useState, useMemo } from 'react'
import { useDatos } from '../../context/DatosContext'
import { HORARIOS } from '../../data/restaurantes'
import { hoyISO, formatoLargo, seSolapan } from '../../utils/fechas'
import Calendario from '../reserva/Calendario'
import ListaReservas from '../reserva/ListaReservas'

export default function AdminReservas({ resto }) {
  const { reservas, cambiarEstado, eliminar, reiniciar } = useDatos()
  const [fecha, setFecha] = useState(hoyISO())
  const propias = useMemo(() => reservas.filter((r) => r.restauranteId === resto.id), [reservas, resto.id])
  const conteo = useMemo(() => propias.filter((r) => r.estado !== 'cancelada').reduce((a, r) => ({ ...a, [r.fecha]: (a[r.fecha] || 0) + 1 }), {}), [propias])
  const delDia = propias.filter((r) => r.fecha === fecha)
  const activas = delDia.filter((r) => r.estado !== 'cancelada')
  const ocup = HORARIOS.map((hora) => ({ hora, n: resto.mesas.filter((m) => activas.some((r) => seSolapan(r, { restauranteId: resto.id, mesaId: m.id, fecha, hora }))).length }))
  const pico = ocup.reduce((a, b) => (b.n > a.n ? b : a), { hora: '—', n: 0 })
  const max = resto.mesas.length

  return (
    <div className="admin">
      <aside>
        <div className="card"><Calendario seleccion={fecha} onSelect={setFecha} conteo={conteo} /></div>
        <button className="btn btn--ghost btn--full" onClick={reiniciar}>Restaurar datos de ejemplo</button>
      </aside>
      <div className="admin__main">
        <h2 className="h2">{formatoLargo(fecha)}</h2>
        <div className="kpis">
          <div className="kpi kpi--red"><span>Reservas activas</span><b>{activas.length}</b></div>
          <div className="kpi kpi--blue"><span>Comensales</span><b>{activas.reduce((s, r) => s + r.personas, 0)}</b></div>
          <div className="kpi kpi--yellow"><span>Hora pico</span><b>{pico.n ? pico.hora : '—'}</b></div>
          <div className="kpi kpi--choc"><span>Cancelaciones</span><b>{delDia.length - activas.length}</b></div>
        </div>
        <div className="card">
          <h3 className="h3">Ocupación por horario</h3>
          <div className="barras" role="img" aria-label="Mesas ocupadas por horario">
            {ocup.map(({ hora, n }) => (
              <div key={hora} className="barra" title={`${hora}: ${n}/${max} mesas`}>
                <div className="barra__fill" style={{ height: `${(n / max) * 100}%` }} data-alta={n / max >= 0.75} />
                <span>{hora.endsWith(':00') ? hora.slice(0, 2) : ''}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="h3">Reservas del día</h3>
          <ListaReservas reservas={delDia} mesas={resto.mesas} cambiarEstado={cambiarEstado} eliminar={eliminar} />
        </div>
      </div>
    </div>
  )
}
