import { useState } from 'react'
import { useDatos } from '../../context/DatosContext'

const VALIDA = {
  nombre: (v) => v.trim().length >= 3 || 'Ingresa tu nombre.',
  correo: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Correo no válido.',
  mensaje: (v) => v.trim().length >= 10 || 'Escribe al menos 10 caracteres.',
}

// Datos de contacto de un restaurante + formulario para escribirle
export default function FichaContacto({ resto }) {
  const { notificar } = useDatos()
  const [f, setF] = useState({ nombre: '', correo: '', mensaje: '' })
  const [tocado, setTocado] = useState(false)
  const errores = Object.fromEntries(Object.entries(VALIDA).map(([k, fn]) => [k, fn(f[k])]).filter(([, v]) => v !== true))

  const enviar = (e) => {
    e.preventDefault(); setTocado(true)
    if (Object.keys(errores).length) return
    notificar(`Mensaje enviado a ${resto.nombre}. Te responderán a ${f.correo}.`)
    setF({ nombre: '', correo: '', mensaje: '' }); setTocado(false)
  }

  return (
    <div className="grid-2">
      <dl className="ficha">
        <div><dt>Dirección</dt><dd>{resto.direccion}</dd></div>
        <div><dt>Teléfono</dt><dd>{resto.telefono}</dd></div>
        <div><dt>WhatsApp</dt><dd>{resto.whatsapp}</dd></div>
        <div><dt>Correo</dt><dd>{resto.correo}</dd></div>
        <div><dt>Horario</dt><dd>{resto.horario}</dd></div>
        <div><dt>Redes</dt><dd>{resto.redes}</dd></div>
      </dl>
      <form onSubmit={enviar} noValidate className="form-contacto">
        <h3 className="h3">Escríbele a {resto.nombre}</h3>
        {[['nombre', 'Nombre', 'text'], ['correo', 'Correo', 'email']].map(([k, l, t]) => (
          <div key={k}>
            <label className="lbl" htmlFor={`c-${k}`}>{l}</label>
            <input id={`c-${k}`} type={t} className={`input ${tocado && errores[k] ? 'input--err' : ''}`} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
            {tocado && errores[k] && <p className="hint">{errores[k]}</p>}
          </div>
        ))}
        <label className="lbl" htmlFor="c-msg">Mensaje</label>
        <textarea id="c-msg" rows={4} className={`input ${tocado && errores.mensaje ? 'input--err' : ''}`} value={f.mensaje}
          onChange={(e) => setF({ ...f, mensaje: e.target.value })} placeholder="Ej. ¿Tienen opciones vegetarianas? ¿Puedo llevar torta?" />
        {tocado && errores.mensaje && <p className="hint">{errores.mensaje}</p>}
        <button className="btn" style={{ marginTop: 14 }}>Enviar mensaje</button>
      </form>
    </div>
  )
}
