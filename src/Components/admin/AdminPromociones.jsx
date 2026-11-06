import { useState } from 'react'
import { useDatos } from '../../context/DatosContext'
import { hoyISO, sumarDias } from '../../utils/fechas'
import PromoCard from '../carta/PromoCard'

const vacio = () => ({ titulo: '', descripcion: '', etiqueta: '', dias: 'Todos los días', hasta: sumarDias(hoyISO(), 30), activa: true })

export default function AdminPromociones({ resto }) {
  const { promosDe, guardarPromo, eliminarPromo, notificar } = useDatos()
  const [f, setF] = useState(vacio)
  const [error, setError] = useState('')
  const promos = promosDe(resto.id)
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))

  const guardar = (e) => {
    e.preventDefault()
    if (f.titulo.trim().length < 3) return setError('Ponle un título a la promoción.')
    if (!f.etiqueta.trim()) return setError('Indica el beneficio, por ejemplo -20%, 2x1 o S/ 45.')
    if (f.hasta < hoyISO()) return setError('La fecha de vigencia no puede estar en el pasado.')
    guardarPromo(resto.id, { ...f, titulo: f.titulo.trim(), etiqueta: f.etiqueta.trim() })
    notificar(f.id ? 'Promoción actualizada.' : 'Promoción publicada.')
    setF(vacio()); setError('')
  }

  return (
    <div className="admin admin--form">
      <form className="card form-admin" onSubmit={guardar} noValidate>
        <h3 className="h3">{f.id ? 'Editar promoción' : 'Nueva promoción'}</h3>
        <label className="lbl" htmlFor="pr-t">Título</label>
        <input id="pr-t" className="input" value={f.titulo} onChange={(e) => set('titulo', e.target.value)} placeholder="Ej. Martes de pasta" />
        <label className="lbl" htmlFor="pr-d">Descripción</label>
        <textarea id="pr-d" rows={2} className="input" value={f.descripcion} onChange={(e) => set('descripcion', e.target.value)} placeholder="Condiciones de la promoción" />
        <div className="campos">
          <div>
            <label className="lbl" htmlFor="pr-e">Beneficio</label>
            <input id="pr-e" className="input" value={f.etiqueta} onChange={(e) => set('etiqueta', e.target.value)} placeholder="-20% · 2x1 · S/ 45" />
          </div>
          <div>
            <label className="lbl" htmlFor="pr-h">Vigente hasta</label>
            <input id="pr-h" type="date" className="input" value={f.hasta} min={hoyISO()} onChange={(e) => set('hasta', e.target.value)} />
          </div>
        </div>
        <label className="lbl" htmlFor="pr-dias">Días</label>
        <input id="pr-dias" className="input" value={f.dias} onChange={(e) => set('dias', e.target.value)} placeholder="Ej. Lunes a jueves" />
        <label className="check"><input type="checkbox" checked={f.activa} onChange={(e) => set('activa', e.target.checked)} /> Visible para los comensales</label>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="form__acciones">
          {f.id && <button type="button" className="btn btn--ghost" onClick={() => { setF(vacio()); setError('') }}>Cancelar</button>}
          <button className="btn">{f.id ? 'Guardar cambios' : 'Publicar promoción'}</button>
        </div>
      </form>
      <div className="card">
        <h3 className="h3">Tus promociones · {promos.length}</h3>
        {!promos.length && <p className="vacio">Aún no tienes promociones.</p>}
        <div className="grid-promos grid-promos--1">
          {promos.map((p) => (
            <PromoCard key={p.id} promo={p} acciones={<>
              <button className="mini mini--ghost" onClick={() => guardarPromo(resto.id, { ...p, activa: !p.activa })}>{p.activa ? 'Pausar' : 'Activar'}</button>
              <button className="mini mini--ghost" onClick={() => { setF(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Editar</button>
              <button className="mini mini--danger" onClick={() => { if (window.confirm(`¿Eliminar "${p.titulo}"?`)) eliminarPromo(resto.id, p.id) }}>Eliminar</button>
            </>} />
          ))}
        </div>
      </div>
    </div>
  )
}
