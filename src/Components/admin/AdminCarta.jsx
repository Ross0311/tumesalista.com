import { useState } from 'react'
import { useDatos } from '../../context/DatosContext'
import { CATEGORIAS } from '../../data/restaurantes'
import CartaMenu from '../carta/CartaMenu'

const VACIO = { nombre: '', descripcion: '', categoria: CATEGORIAS[1], precio: '', disponible: true }

export default function AdminCarta({ resto }) {
  const { platosDe, guardarPlato, eliminarPlato, notificar } = useDatos()
  const [f, setF] = useState(VACIO)
  const [error, setError] = useState('')
  const platos = platosDe(resto.id)
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))

  const guardar = (e) => {
    e.preventDefault()
    const precio = Number(f.precio)
    if (f.nombre.trim().length < 3) return setError('El nombre del plato debe tener al menos 3 letras.')
    if (!(precio > 0) || precio > 9999) return setError('Ingresa un precio válido en soles.')
    guardarPlato(resto.id, { ...f, nombre: f.nombre.trim(), descripcion: f.descripcion.trim(), precio: Math.round(precio * 100) / 100 })
    notificar(f.id ? `Se actualizó "${f.nombre.trim()}".` : `"${f.nombre.trim()}" se agregó a la carta.`)
    setF(VACIO); setError('')
  }

  return (
    <div className="admin admin--form">
      <form className="card form-admin" onSubmit={guardar} noValidate>
        <h3 className="h3">{f.id ? 'Editar plato' : 'Agregar plato'}</h3>
        <label className="lbl" htmlFor="p-nom">Nombre</label>
        <input id="p-nom" className="input" value={f.nombre} onChange={(e) => set('nombre', e.target.value)} placeholder="Ej. Lomo saltado" />
        <label className="lbl" htmlFor="p-desc">Descripción</label>
        <textarea id="p-desc" rows={2} className="input" value={f.descripcion} onChange={(e) => set('descripcion', e.target.value)} placeholder="Ingredientes o porción" />
        <div className="campos">
          <div>
            <label className="lbl" htmlFor="p-cat">Categoría</label>
            <select id="p-cat" className="input" value={f.categoria} onChange={(e) => set('categoria', e.target.value)}>
              {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="lbl" htmlFor="p-pre">Precio (S/)</label>
            <input id="p-pre" className="input" inputMode="decimal" value={f.precio} onChange={(e) => set('precio', e.target.value.replace(/[^\d.]/g, ''))} placeholder="0.00" />
          </div>
        </div>
        <label className="check"><input type="checkbox" checked={f.disponible} onChange={(e) => set('disponible', e.target.checked)} /> Disponible hoy</label>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="form__acciones">
          {f.id && <button type="button" className="btn btn--ghost" onClick={() => { setF(VACIO); setError('') }}>Cancelar</button>}
          <button className="btn">{f.id ? 'Guardar cambios' : 'Agregar a la carta'}</button>
        </div>
      </form>
      <div className="card">
        <div className="seccion__head"><h3 className="h3">Carta publicada · {platos.length} platos</h3></div>
        <CartaMenu platos={platos} acciones={(p) => (
          <>
            <button className="mini mini--ghost" onClick={() => guardarPlato(resto.id, { ...p, disponible: !p.disponible })}>{p.disponible ? 'Agotar' : 'Activar'}</button>
            <button className="mini mini--ghost" onClick={() => { setF({ ...p, precio: String(p.precio) }); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Editar</button>
            <button className="mini mini--danger" onClick={() => { if (window.confirm(`¿Eliminar "${p.nombre}"?`)) eliminarPlato(resto.id, p.id) }}>Eliminar</button>
          </>
        )} />
      </div>
    </div>
  )
}
