// Plano de mesas: libre / ocupada / no apta por capacidad / seleccionada
export default function MapaMesas({ mesas, ocupadas, personas, seleccion, onSelect }) {
  return (
    <div className="mapa">
      {mesas.map((m) => {
        const ocupada = ocupadas.has(m.id)
        const chica = m.capacidad < personas
        return (
          <button key={m.id} type="button" disabled={ocupada || chica} onClick={() => onSelect(m.id)}
            className={`mesa ${m.capacidad >= 6 ? 'mesa--grande' : ''} ${seleccion === m.id ? 'is-sel' : ''} ${ocupada ? 'is-ocupada' : ''}`}
            aria-pressed={seleccion === m.id}>
            <span className="mesa__n">{m.id}</span>
            <span className="mesa__info">{m.capacidad} pers · {m.zona}</span>
            {ocupada && <span className="mesa__tag">Ocupada</span>}
            {!ocupada && chica && <span className="mesa__tag">Pequeña</span>}
          </button>
        )
      })}
    </div>
  )
}
