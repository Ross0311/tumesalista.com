import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useLocation, Link } from 'react-router-dom'
import Calendario from './reserva/Calendario'
import SelectorHorario from './reserva/SelectorHorario'
import SelectorRestaurante from './reserva/SelectorRestaurante'
import MapaMesas from './reserva/MapaMesas'
import { HORARIOS, getRestaurante } from '../data/restaurantes'
import { hoyISO, formatoLargo, seSolapan } from '../utils/fechas'
import { useDatos } from '../context/DatosContext'
import { REGLAS, estadoDni, requiereGarantia } from '../utils/reglas'
import Modal from './ui/Modal'
import MensajeSimulado from './reserva/MensajeSimulado'

const PASOS = ['Restaurante', 'Fecha y hora', 'Mesa', 'Tus datos']
const VACIO = { dni: '', nombres: '', apellidos: '', celular: '', correo: '' }
const VALIDA = {
  dni: (v) => /^\d{8}$/.test(v) || 'El DNI tiene 8 dígitos.',
  nombres: (v) => v.trim().length >= 2 || 'Ingresa tus nombres.',
  apellidos: (v) => v.trim().length >= 2 || 'Ingresa tus apellidos.',
  celular: (v) => /^9\d{8}$/.test(v) || '9 dígitos, empieza con 9.',
  correo: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Correo no válido.',
}

export default function Reservar() {
  const { reservas, activas, crear, cambiarEstado, notificar } = useDatos()
  const [params] = useSearchParams()
  const inicial = getRestaurante(params.get('r'))?.id ?? ''
  const [paso, setPaso] = useState(inicial ? 1 : 0)
  const [hechaId, setHechaId] = useState(null)
  const hecha = reservas.find((r) => r.id === hechaId) // se lee del estado global para reflejar la respuesta al mensaje
  const [aviso, setAviso] = useState(false)
  const [acepta, setAcepta] = useState(false)
  const [yape, setYape] = useState('')
  const cerrarAviso = useCallback(() => setAviso(false), [])
  // Si el usuario vuelve a entrar a /reservar desde el menú, empieza una reserva nueva
  const { key } = useLocation()
  useEffect(() => { setHechaId(null) }, [key])
  const [form, setForm] = useState({ restauranteId: inicial, fecha: hoyISO(), hora: '', personas: 2, mesaId: null, ...VACIO })
  const [tocado, setTocado] = useState({})
  const [error, setError] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const resto = getRestaurante(form.restauranteId)
  const mesas = useMemo(() => resto?.mesas ?? [], [resto])
  const maxPers = Math.max(1, ...mesas.map((m) => m.capacidad))

  const activasHoy = useMemo(() => activas.filter((r) => r.fecha === hoyISO())
    .reduce((a, r) => ({ ...a, [r.restauranteId]: (a[r.restauranteId] || 0) + 1 }), {}), [activas])

  // Mesas libres por horario para el restaurante, fecha y tamaño de grupo elegidos
  const libresPorHora = useMemo(() => {
    const res = {}
    HORARIOS.forEach((hora) => {
      res[hora] = mesas.filter((m) => m.capacidad >= form.personas &&
        !activas.some((r) => seSolapan(r, { restauranteId: form.restauranteId, mesaId: m.id, fecha: form.fecha, hora }))).length
    })
    return res
  }, [activas, mesas, form.restauranteId, form.fecha, form.personas])

  const ocupadas = useMemo(() => new Set(form.hora
    ? mesas.filter((m) => activas.some((r) => seSolapan(r, { restauranteId: form.restauranteId, mesaId: m.id, fecha: form.fecha, hora: form.hora }))).map((m) => m.id)
    : []), [activas, mesas, form.restauranteId, form.fecha, form.hora])

  // useEffect: al cambiar de restaurante se reinicia la selección dependiente
  useEffect(() => { if (resto) setForm((f) => ({ ...f, hora: '', mesaId: null, personas: Math.min(f.personas, maxPers) })) }, [form.restauranteId]) // eslint-disable-line react-hooks/exhaustive-deps
  // useEffect: si la hora o la mesa dejan de estar disponibles, se limpian
  useEffect(() => { if (form.hora && !libresPorHora[form.hora]) set('hora', '') }, [libresPorHora]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const m = mesas.find((x) => x.id === form.mesaId)
    if (m && (ocupadas.has(m.id) || m.capacidad < form.personas)) set('mesaId', null)
  }, [ocupadas, form.personas]) // eslint-disable-line react-hooks/exhaustive-deps

  const errores = Object.fromEntries(Object.entries(VALIDA).map(([k, fn]) => [k, fn(form[k])]).filter(([, v]) => v !== true))
  const puedeSeguir = [form.restauranteId, form.fecha && form.hora, form.mesaId, !Object.keys(errores).length][paso]

  // 1) Valida el formulario y abre el aviso emergente con las condiciones
  const enviar = (e) => {
    e.preventDefault()
    if (!puedeSeguir) { setTocado(Object.fromEntries(Object.keys(VALIDA).map((k) => [k, true]))); return }
    const bloqueo = estadoDni(form.dni, reservas)
    if (bloqueo.bloqueado) { setError(`Este DNI tiene ${bloqueo.faltas} inasistencias recientes y no puede reservar hasta el ${bloqueo.hasta.split('-').reverse().join('/')}.`); return }
    setError(''); setAcepta(false); setYape(''); setAviso(true)
  }

  // 2) Al aceptar el aviso se registra la reserva
  const garantia = requiereGarantia(form.personas)
  const puedeAceptar = acepta && (!garantia || /^\d{6,12}$/.test(yape))
  const confirmar = () => {
    const datos = { ...form, nombres: form.nombres.trim(), apellidos: form.apellidos.trim(), correo: form.correo.trim().toLowerCase(),
      ...(garantia ? { garantia: { monto: REGLAS.MONTO_GARANTIA, operacion: yape } } : {}) }
    const r = crear(datos)
    setAviso(false)
    if (!r.ok) { setError(r.error); if (r.error.includes('mesa')) setPaso(2); return }
    setHechaId(r.reserva.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    notificar(`¡Listo, ${r.reserva.nombres.split(' ')[0]}! Tu reserva fue registrada.`)
    setForm((f) => ({ ...f, hora: '', mesaId: null })); setPaso(0); setTocado({})
  }

  const campo = (k, label, props = {}) => (
    <div className={props.full ? 'campo campo--full' : 'campo'}>
      <label className="lbl" htmlFor={k}>{label}</label>
      <input id={k} className={`input ${tocado[k] && errores[k] ? 'input--err' : ''}`} value={form[k]}
        onChange={(e) => set(k, props.digits ? e.target.value.replace(/\D/g, '') : e.target.value)}
        onBlur={() => setTocado((t) => ({ ...t, [k]: true }))} {...props.attrs} />
      {tocado[k] && errores[k] && <p className="hint">{errores[k]}</p>}
    </div>
  )

  if (hecha) {
    const rh = getRestaurante(hecha.restauranteId)
    return (
      <div className="card confirmacion fade">
        <span className="confirmacion__ok">✓</span>
        <h2 className="logo__script confirmacion__tit">¡Listo, {hecha.nombres.split(' ')[0]}!</h2>
        <p className="h3">Tu reserva fue registrada.</p>
        <p className="muted">Enviamos el detalle a {hecha.correo}</p>
        <dl className="ticket">
          <div><dt>Restaurante</dt><dd>{rh.nombre}</dd></div>
          <div><dt>Fecha</dt><dd>{formatoLargo(hecha.fecha)}</dd></div>
          <div><dt>Hora</dt><dd>{hecha.hora} (90 min)</dd></div>
          <div><dt>Mesa</dt><dd>Mesa {hecha.mesaId} — {rh.mesas.find((m) => m.id === hecha.mesaId)?.zona}</dd></div>
          <div><dt>Personas</dt><dd>{hecha.personas}</dd></div>
          <div><dt>A nombre de</dt><dd>{hecha.nombres} {hecha.apellidos} · DNI {hecha.dni}</dd></div>
          <div><dt>Estado</dt><dd><span className={`badge badge--${hecha.estado}`}>{{ pendiente: 'Por reconfirmar', confirmada: 'Confirmada', cancelada: 'Cancelada' }[hecha.estado] ?? hecha.estado}</span></dd></div>
          {hecha.garantia && <div><dt>Garantía</dt><dd>S/ {hecha.garantia.monto} por Yape · Op. {hecha.garantia.operacion}</dd></div>}
        </dl>
        <div className="confirmacion__msg">
          <p className="lbl">Así te llegará el recordatorio por WhatsApp y correo ({REGLAS.RECORDATORIO_HORAS} h antes). <span className="muted">Simulación: puedes responder aquí.</span></p>
          <MensajeSimulado reserva={hecha} onResponder={(estado) => { cambiarEstado(hecha.id, estado); notificar(estado === 'confirmada' ? 'Asistencia confirmada.' : 'Reserva cancelada: la mesa quedó libre.') }} />
        </div>
        <div className="confirmacion__acc">
          <Link to="/mis-reservas" className="btn btn--ghost">Mis reservas</Link>
          <button className="btn" onClick={() => setHechaId(null)}>Hacer otra reserva</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fade">
    <div className="hero">
      <p className="eyebrow">Reservar mesa</p>
      <h1>Tu mesa, lista <em>cuando llegas.</em></h1>
      <p className="muted">Elige restaurante, día, hora y mesa. Sin crear cuenta: solo tu DNI y datos de contacto.</p>
    </div>
    <form className="card form" onSubmit={enviar} noValidate>
      <ol className="pasos">
        {PASOS.map((p, i) => (
          <li key={p} className={`${i === paso ? 'is-act' : ''} ${i < paso ? 'is-ok' : ''}`}>
            <span>{i < paso ? '✓' : i + 1}</span>{p}
          </li>
        ))}
      </ol>

      <div className="paso" key={paso}>
        {paso === 0 && (
          <>
            <label className="lbl">¿Dónde quieres reservar?</label>
            <SelectorRestaurante valor={form.restauranteId} onChange={(id) => set('restauranteId', id)} activasHoy={activasHoy} />
          </>
        )}

        {paso === 1 && (
          <div className="grid-2">
            <div>
              <p className="resto-chip">{resto.nombre} · {resto.distrito} <Link to={`/restaurantes/${resto.id}`} className="link">ver carta</Link></p>
              <label className="lbl">¿Cuántas personas?</label>
              <div className="contador">
                <button type="button" className="icon-btn" onClick={() => set('personas', Math.max(1, form.personas - 1))} aria-label="Menos">−</button>
                <strong>{form.personas}</strong>
                <button type="button" className="icon-btn" onClick={() => set('personas', Math.min(maxPers, form.personas + 1))} aria-label="Más">+</button>
              </div>
              <label className="lbl">Fecha</label>
              <Calendario seleccion={form.fecha} onSelect={(f) => set('fecha', f)} bloquearPasado />
            </div>
            <div>
              <label className="lbl">Horario · <span className="muted">{formatoLargo(form.fecha).toLowerCase()}</span></label>
              <SelectorHorario valor={form.hora} onChange={(h) => set('hora', h)} libresPorHora={libresPorHora} />
              <p className="leyenda"><i className="dot dot--y" /> pocas mesas <i className="dot dot--off" /> lleno</p>
            </div>
          </div>
        )}

        {paso === 2 && (
          <>
            <label className="lbl">Elige tu mesa en {resto.nombre} · {formatoLargo(form.fecha)}, {form.hora}</label>
            <MapaMesas mesas={mesas} ocupadas={ocupadas} personas={form.personas} seleccion={form.mesaId} onSelect={(id) => { set('mesaId', id); setError('') }} />
            {error && <p className="error" role="alert">{error}</p>}
          </>
        )}

        {paso === 3 && (
          <div className="grid-2">
            <div>
              <p className="muted nota">No necesitas crear una cuenta: con tu DNI y datos de contacto confirmamos tu reserva.</p>
              <div className="campos">
                {campo('dni', 'DNI', { digits: true, attrs: { inputMode: 'numeric', maxLength: 8, placeholder: '12345678' } })}
                {campo('celular', 'Celular', { digits: true, attrs: { inputMode: 'numeric', maxLength: 9, placeholder: '9XXXXXXXX', autoComplete: 'tel' } })}
                {campo('nombres', 'Nombres', { attrs: { placeholder: 'Lucía', autoComplete: 'given-name' } })}
                {campo('apellidos', 'Apellidos', { attrs: { placeholder: 'Torres Díaz', autoComplete: 'family-name' } })}
                {campo('correo', 'Correo electrónico', { full: true, attrs: { type: 'email', placeholder: 'tucorreo@ejemplo.com', autoComplete: 'email' } })}
              </div>
              {error && <p className="error" role="alert">{error}</p>}
            </div>
            <div className="resumen">
              <h4>Resumen</h4>
              <p><b>{resto.nombre}</b></p>
              <p className="muted">{resto.tipo} · {resto.distrito}</p>
              <p><b>{formatoLargo(form.fecha)}</b></p>
              <p>{form.hora} · {form.personas} {form.personas === 1 ? 'persona' : 'personas'}</p>
              <p>Mesa {form.mesaId} — {mesas.find((m) => m.id === form.mesaId)?.zona}</p>
              <p className="muted">Tu mesa queda reservada 90 minutos. Te enviaremos la confirmación por correo.</p>
            </div>
          </div>
        )}
      </div>

      <div className="form__acciones">
        {paso > 0 && <button type="button" className="btn btn--ghost" onClick={() => setPaso(paso - 1)}>Atrás</button>}
        {paso < 3
          ? <button key="continuar" type="button" className="btn" disabled={!puedeSeguir} onClick={() => setPaso(paso + 1)}>Continuar</button>
          : <button key="confirmar" type="submit" className="btn">Confirmar reserva</button>}
      </div>
    </form>

    <Modal abierto={aviso} onCerrar={cerrarAviso} titulo="Antes de confirmar tu reserva"
      acciones={<>
        <button className="btn btn--ghost" onClick={cerrarAviso}>Volver</button>
        <button className="btn" disabled={!puedeAceptar} onClick={confirmar}>Acepto y reservo</button>
      </>}>
      <ul className="politicas">
        <li><span className="politicas__ico">📲</span><div><b>Te enviaremos un mensaje {REGLAS.RECORDATORIO_HORAS} horas antes</b> por WhatsApp al {form.celular} y a {form.correo} para que reconfirmes tu asistencia.</div></li>
        <li><span className="politicas__ico">⚠️</span><div><b>Si no respondes</b>, tu reserva quedará como <i>sin respuesta</i> y el restaurante podrá liberar la mesa para otra persona.</div></li>
        <li><span className="politicas__ico">⏱️</span><div><b>Tolerancia de {REGLAS.TOLERANCIA_MIN} minutos.</b> Pasado ese tiempo se registra como inasistencia y la mesa se libera.</div></li>
        <li><span className="politicas__ico">🚫</span><div><b>{REGLAS.MAX_INASISTENCIAS} inasistencias</b> bloquean tu DNI por {REGLAS.DIAS_BLOQUEO} días. Si no puedes ir, cancela gratis desde <i>Mis reservas</i>.</div></li>
      </ul>
      {garantia && (
        <div className="garantia">
          <b>Grupo de {form.personas} personas: garantía de S/ {REGLAS.MONTO_GARANTIA}</b>
          <p className="muted">Yapea al <b>{resto?.whatsapp}</b> ({resto?.nombre}). Se descuenta de tu cuenta; si no asistes, no se devuelve.</p>
          <label className="lbl" htmlFor="yape">N.° de operación Yape</label>
          <input id="yape" className="input" inputMode="numeric" maxLength={12} value={yape} onChange={(e) => setYape(e.target.value.replace(/\D/g, ''))} placeholder="Ej. 01234567" />
          {yape && !/^\d{6,12}$/.test(yape) && <p className="hint">Entre 6 y 12 dígitos.</p>}
        </div>
      )}
      <label className="check"><input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} /> Entiendo y acepto estas condiciones</label>
    </Modal>
    </div>
  )
}
