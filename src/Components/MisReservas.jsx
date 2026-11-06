import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDatos } from '../context/DatosContext'
import { getRestaurante } from '../data/restaurantes'
import { formatoLargo, hoyISO } from '../utils/fechas'
import { REGLAS, estadoDni, sinRespuesta } from '../utils/reglas'
import RestoAvatar from './ui/RestoAvatar'

const ETIQUETA = { pendiente: 'Por reconfirmar', confirmada: 'Confirmada', cancelada: 'Cancelada', atendida: 'Atendida', no_asistio: 'No asistió' }

// El comensal consulta sus reservas con DNI + celular y las reconfirma o cancela en un clic
export default function MisReservas() {
  const { reservas, cambiarEstado, notificar } = useDatos()
  const [f, setF] = useState({ dni: '', celular: '' })
  const [buscado, setBuscado] = useState(null)
  const [error, setError] = useState('')

  const propias = useMemo(() => (buscado
    ? reservas.filter((r) => r.dni === buscado.dni && r.celular === buscado.celular).sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora))
    : []), [reservas, buscado])
  const proximas = propias.filter((r) => r.fecha >= hoyISO() && ['pendiente', 'confirmada'].includes(r.estado))
  const historial = propias.filter((r) => !proximas.includes(r)).slice(0, 8)
  const estado = buscado ? estadoDni(buscado.dni, reservas) : null

  const buscar = (e) => {
    e.preventDefault()
    if (!/^\d{8}$/.test(f.dni) || !/^9\d{8}$/.test(f.celular)) return setError('Ingresa tu DNI (8 dígitos) y el celular con el que reservaste (9 dígitos).')
    setError(''); setBuscado({ ...f })
  }
  const responder = (r, nuevo) => {
    if (nuevo === 'cancelada' && !window.confirm('¿Seguro que quieres cancelar esta reserva?')) return
    cambiarEstado(r.id, nuevo)
    notificar(nuevo === 'confirmada' ? '¡Gracias! Tu asistencia quedó confirmada.' : 'Reserva cancelada. La mesa quedó libre para otra persona.')
  }

  return (
    <div className="fade">
      <div className="hero">
        <p className="eyebrow">Mis reservas</p>
        <h1>Confirma o cancela <em>en un clic.</em></h1>
        <p className="muted">Si no puedes ir, avísanos: liberas la mesa para otra persona y evitas una inasistencia en tu historial.</p>
      </div>

      <form className="card mis__form" onSubmit={buscar} noValidate>
        <div>
          <label className="lbl" htmlFor="m-dni">DNI</label>
          <input id="m-dni" className="input" inputMode="numeric" maxLength={8} value={f.dni} onChange={(e) => setF({ ...f, dni: e.target.value.replace(/\D/g, '') })} placeholder="12345678" />
        </div>
        <div>
          <label className="lbl" htmlFor="m-cel">Celular</label>
          <input id="m-cel" className="input" inputMode="numeric" maxLength={9} value={f.celular} onChange={(e) => setF({ ...f, celular: e.target.value.replace(/\D/g, '') })} placeholder="9XXXXXXXX" />
        </div>
        <button className="btn">Ver mis reservas</button>
        {error && <p className="error mis__error" role="alert">{error}</p>}
      </form>

      {buscado && (
        <>
          {estado.bloqueado ? (
            <p className="alerta alerta--mal">Tu DNI tiene <b>{estado.faltas} inasistencias</b> recientes. No podrás hacer nuevas reservas hasta el <b>{formatoLargo(estado.hasta)}</b>.</p>
          ) : estado.faltas > 0 ? (
            <p className="alerta">Tienes <b>{estado.faltas} inasistencia</b> reciente. Con {REGLAS.MAX_INASISTENCIAS} inasistencias tu DNI se bloquea {REGLAS.DIAS_BLOQUEO} días.</p>
          ) : null}

          <h2 className="h2">Próximas reservas</h2>
          {!proximas.length && <p className="vacio card">No tienes reservas próximas. <Link className="link" to="/reservar">Reservar una mesa</Link></p>}
          <div className="mis__lista">
            {proximas.map((r) => {
              const resto = getRestaurante(r.restauranteId)
              return (
                <article key={r.id} className={`card mis__item ${sinRespuesta(r) ? 'mis__item--urgente' : ''}`}>
                  <RestoAvatar resto={resto} size={56} />
                  <div className="mis__info">
                    <strong>{resto.nombre}</strong>
                    <span>{formatoLargo(r.fecha)} · {r.hora} · Mesa {r.mesaId} · {r.personas} pers.</span>
                    <span className={`badge badge--${r.estado}`}>{ETIQUETA[r.estado]}</span>
                    {r.estado === 'pendiente' && <small className="muted">{sinRespuesta(r) ? 'Confirma ahora: el restaurante podría liberar tu mesa.' : `Te escribiremos ${REGLAS.RECORDATORIO_HORAS} h antes para reconfirmar.`}</small>}
                  </div>
                  <div className="mis__acc">
                    {r.estado === 'pendiente' && <button className="btn btn--sm" onClick={() => responder(r, 'confirmada')}>Confirmo que voy</button>}
                    <button className="btn btn--ghost btn--sm" onClick={() => responder(r, 'cancelada')}>Cancelar</button>
                  </div>
                </article>
              )
            })}
          </div>

          {historial.length > 0 && (
            <>
              <h2 className="h2" style={{ marginTop: 24 }}>Historial</h2>
              <ul className="card mis__hist">
                {historial.map((r) => (
                  <li key={r.id}><span>{getRestaurante(r.restauranteId).nombre} · {formatoLargo(r.fecha)} · {r.hora}</span><span className={`badge badge--${r.estado}`}>{ETIQUETA[r.estado]}</span></li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  )
}
