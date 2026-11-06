import { CATEGORIAS } from '../../data/restaurantes'
import { soles } from '../../utils/fechas'

// Carta agrupada por categoría. Se usa en la vista del comensal y en la vista previa del admin.
export default function CartaMenu({ platos, acciones }) {
  if (!platos.length) return <p className="vacio">Este restaurante aún no publicó su carta.</p>
  return (
    <div className="carta">
      {CATEGORIAS.map((cat) => {
        const items = platos.filter((p) => p.categoria === cat)
        if (!items.length) return null
        return (
          <section key={cat} className="carta__cat">
            <h3 className="carta__titulo">{cat}</h3>
            <ul>
              {items.map((p) => (
                <li key={p.id} className={`plato ${p.disponible ? '' : 'plato--off'}`}>
                  <div className="plato__txt">
                    <span className="plato__nombre">{p.nombre}{!p.disponible && <span className="tag-off">Agotado</span>}</span>
                    <span className="muted">{p.descripcion}</span>
                  </div>
                  <span className="plato__linea" aria-hidden="true" />
                  <span className="plato__precio">{soles(p.precio)}</span>
                  {acciones && <span className="plato__acc">{acciones(p)}</span>}
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
