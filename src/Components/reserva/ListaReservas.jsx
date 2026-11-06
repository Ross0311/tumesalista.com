import { estadoDni, sinRespuesta, toleranciaVencida, REGLAS } from '../../utils/reglas'

const ETIQUETA = { pendiente: 'Por reconfirmar', confirmada: 'Confirmada', cancelada: 'Cancelada', atendida: 'Atendida', no_asistio: 'No asistió' }

export default function ListaReservas({ reservas, mesas, cambiarEstado, eliminar, todas = [] }) {
  if (!reservas.length) return <p className="vacio">No hay reservas para este día.</p>
  return (
    <ul className="lista">
      {[...reservas].sort((a, b) => a.hora.localeCompare(b.hora)).map((r) => {
        const sinResp = sinRespuesta(r)
        const tolerancia = toleranciaVencida(r)
        const faltas = estadoDni(r.dni, todas).faltas
        return (
          <li key={r.id} className={`item item--${r.estado} ${sinResp ? 'item--alerta' : ''}`}>
            <div className="item__hora">{r.hora}</div>
            <div className="item__info">
              <strong>{r.nombres} {r.apellidos}
                {faltas > 0 && <span className="tag-falta" title="Inasistencias en los últimos 90 días">{faltas} inasistencia{faltas > 1 ? 's' : ''}</span>}
                {r.garantia && <span className="tag-garantia">Garantía S/ {r.garantia.monto}</span>}
              </strong>
              <span className="muted">{mesas.find((m) => m.id === r.mesaId)?.nombre} · {r.personas} pers · DNI {r.dni} · {r.celular}</span>
              {sinResp && !tolerancia && <span className="item__aviso">Sin respuesta al recordatorio: puedes liberar la mesa.</span>}
              {tolerancia && <span className="item__aviso">Pasaron más de {REGLAS.TOLERANCIA_MIN} min de la hora: ¿llegó?</span>}
            </div>
            <span className={`badge badge--${sinResp ? 'alerta' : r.estado}`}>{sinResp ? 'Sin respuesta' : ETIQUETA[r.estado]}</span>
            <div className="item__acc">
              {r.estado === 'pendiente' && !tolerancia && <button className="mini" onClick={() => cambiarEstado(r.id, 'confirmada')}>Confirmar</button>}
              {['pendiente', 'confirmada'].includes(r.estado) && tolerancia && <button className="mini" onClick={() => cambiarEstado(r.id, 'atendida')}>Llegó</button>}
              {r.estado === 'confirmada' && !tolerancia && <button className="mini" onClick={() => cambiarEstado(r.id, 'atendida')}>Llegó</button>}
              {tolerancia && <button className="mini mini--danger" onClick={() => cambiarEstado(r.id, 'no_asistio')}>No asistió</button>}
              {sinResp && !tolerancia && <button className="mini mini--danger" onClick={() => { if (window.confirm('¿Liberar la mesa? La reserva quedará cancelada.')) cambiarEstado(r.id, 'cancelada') }}>Liberar mesa</button>}
              {['pendiente', 'confirmada'].includes(r.estado) && !sinResp && !tolerancia && <button className="mini mini--ghost" onClick={() => cambiarEstado(r.id, 'cancelada')}>Cancelar</button>}
              {['cancelada', 'no_asistio'].includes(r.estado) && <button className="mini mini--ghost" onClick={() => eliminar(r.id)}>Eliminar</button>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
