const ETIQUETA = { pendiente: 'Pendiente', confirmada: 'Confirmada', cancelada: 'Cancelada', atendida: 'Atendida' }

export default function ListaReservas({ reservas, mesas, cambiarEstado, eliminar }) {
  if (!reservas.length) return <p className="vacio">No hay reservas para este día.</p>
  return (
    <ul className="lista">
      {[...reservas].sort((a, b) => a.hora.localeCompare(b.hora)).map((r) => (
        <li key={r.id} className={`item item--${r.estado}`}>
          <div className="item__hora">{r.hora}</div>
          <div className="item__info">
            <strong>{r.nombres} {r.apellidos}</strong>
            <span className="muted">{mesas.find((m) => m.id === r.mesaId)?.nombre} · {r.personas} pers · DNI {r.dni} · {r.celular}</span>
          </div>
          <span className={`badge badge--${r.estado}`}>{ETIQUETA[r.estado]}</span>
          <div className="item__acc">
            {r.estado === 'pendiente' && <button className="mini" onClick={() => cambiarEstado(r.id, 'confirmada')}>Confirmar</button>}
            {r.estado === 'confirmada' && <button className="mini" onClick={() => cambiarEstado(r.id, 'atendida')}>Llegó</button>}
            {r.estado !== 'cancelada' && r.estado !== 'atendida' && <button className="mini mini--ghost" onClick={() => cambiarEstado(r.id, 'cancelada')}>Cancelar</button>}
            {r.estado === 'cancelada' && <button className="mini mini--ghost" onClick={() => eliminar(r.id)}>Eliminar</button>}
          </div>
        </li>
      ))}
    </ul>
  )
}
