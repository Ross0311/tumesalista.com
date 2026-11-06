import { HORARIOS } from '../../data/restaurantes'
import { seSolapan } from '../../utils/fechas'

// 4 reportes clave para la administración
export default function Reportes({ delDia, fecha, mesas, restauranteId }) {
  const activas = delDia.filter((r) => r.estado !== 'cancelada')
  const comensales = activas.reduce((s, r) => s + r.personas, 0)
  const canceladas = delDia.filter((r) => r.estado === 'cancelada').length
  const ocupPorHora = HORARIOS.map((hora) => ({
    hora, n: mesas.filter((m) => activas.some((r) => seSolapan(r, { restauranteId, mesaId: m.id, fecha, hora }))).length,
  }))
  const pico = ocupPorHora.reduce((a, b) => (b.n > a.n ? b : a), { hora: '—', n: 0 })
  const max = mesas.length

  return (
    <>
      <div className="kpis">
        <div className="kpi kpi--red"><span>Reservas activas</span><b>{activas.length}</b></div>
        <div className="kpi kpi--blue"><span>Comensales</span><b>{comensales}</b></div>
        <div className="kpi kpi--yellow"><span>Hora pico</span><b>{pico.n ? pico.hora : '—'}</b></div>
        <div className="kpi kpi--choc"><span>Cancelaciones</span><b>{canceladas}</b></div>
      </div>
      <div className="card">
        <h3 className="h3">Ocupación por horario</h3>
        <div className="barras" role="img" aria-label="Mesas ocupadas por horario">
          {ocupPorHora.map(({ hora, n }) => (
            <div key={hora} className="barra" title={`${hora}: ${n}/${max} mesas`}>
              <div className="barra__fill" style={{ height: `${(n / max) * 100}%` }} data-alta={n / max >= 0.75} />
              <span>{hora.endsWith(':00') ? hora.slice(0, 2) : ''}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
