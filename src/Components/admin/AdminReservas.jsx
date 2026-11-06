import { useState, useMemo } from 'react'
import { useDatos } from '../../context/DatosContext'
import { HORARIOS } from '../../data/restaurantes'
import { hoyISO, formatoLargo, seSolapan } from '../../utils/fechas'
import { ESTADOS_LIBRES, sinRespuesta, REGLAS } from '../../utils/reglas'
import Calendario from '../reserva/Calendario'
import ListaReservas from '../reserva/ListaReservas'

export default function AdminReservas({ resto }) {
  const { reservas, cambiarEstado, eliminar, reiniciar, horaSimulada, simularHora } = useDatos()
  const [fecha, setFecha] = useState(hoyISO())
  const propias = useMemo(() => reservas.filter((r) => r.restauranteId === resto.id), [reservas, resto.id])
  const conteo = useMemo(() => propias.filter((r) => !ESTADOS_LIBRES.includes(r.estado)).reduce((a, r) => ({ ...a, [r.fecha]: (a[r.fecha] || 0) + 1 }), {}), [propias])
  const delDia = propias.filter((r) => r.fecha === fecha)
  const activas = delDia.filter((r) => !ESTADOS_LIBRES.includes(r.estado))
  const sinResp = delDia.filter(sinRespuesta).length
  const faltas = delDia.filter((r) => r.estado === 'no_asistio').length
  const ocup = HORARIOS.map((hora) => ({ hora, n: resto.mesas.filter((m) => activas.some((r) => seSolapan(r, { restauranteId: resto.id, mesaId: m.id, fecha, hora }))).length }))
  const pico = ocup.reduce((a, b) => (b.n > a.n ? b : a), { hora: '—', n: 0 })
  const max = resto.mesas.length

  return (
    <div className="admin">
      <aside>
        <div className="card"><Calendario seleccion={fecha} onSelect={setFecha} conteo={conteo} /></div>
        <div className="card demo-hora">
          <h4 className="h3">Modo demostración</h4>
          <p className="muted">Simula la hora actual para ver reservas <b>sin respuesta</b> ({REGLAS.RECORDATORIO_HORAS} h antes) y la tolerancia de <b>{REGLAS.TOLERANCIA_MIN} min</b>.</p>
          <div className="demo-hora__fila">
            <input type="time" className="input" value={horaSimulada ?? ''} onChange={(e) => simularHora(e.target.value)} aria-label="Hora simulada" />
            {horaSimulada && <button className="btn btn--ghost btn--sm" onClick={() => simularHora(null)}>Hora real</button>}
          </div>
          {horaSimulada && <p className="demo-hora__on">Simulando las {horaSimulada}</p>}
        </div>
        <button className="btn btn--ghost btn--full" onClick={reiniciar}>Restaurar datos de ejemplo</button>
      </aside>
      <div className="admin__main">
        <h2 className="h2">{formatoLargo(fecha)}</h2>
        <div className="kpis">
          <div className="kpi kpi--red"><span>Reservas activas</span><b>{activas.length}</b></div>
          <div className="kpi kpi--blue"><span>Comensales</span><b>{activas.reduce((s, r) => s + r.personas, 0)}</b></div>
          <div className="kpi kpi--yellow"><span>Hora pico</span><b>{pico.n ? pico.hora : '—'}</b></div>
          <div className="kpi kpi--choc"><span>Cancel. / No asistió</span><b>{delDia.length - activas.length - faltas} / {faltas}</b></div>
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
          {sinResp > 0 && <p className="alerta">{sinResp} {sinResp === 1 ? 'reserva no respondió' : 'reservas no respondieron'} al recordatorio enviado {REGLAS.RECORDATORIO_HORAS} h antes. Puedes llamar al cliente o liberar la mesa.</p>}
          <ListaReservas reservas={delDia} mesas={resto.mesas} cambiarEstado={cambiarEstado} eliminar={eliminar} todas={reservas} />
        </div>
      </div>
    </div>
  )
}
