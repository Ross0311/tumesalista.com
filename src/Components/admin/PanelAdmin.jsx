import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDatos } from '../../context/DatosContext'
import { getRestaurante } from '../../data/restaurantes'
import LoginAdmin from './LoginAdmin'
import AdminReservas from './AdminReservas'
import AdminCarta from './AdminCarta'
import AdminPromociones from './AdminPromociones'
import AdminReportes from './AdminReportes'

const TABS = [['reservas', 'Reservas'], ['carta', 'Carta y precios'], ['promos', 'Promociones'], ['reportes', 'Reportes']]

// Ruta protegida: sin sesión muestra el login; con sesión, el panel de SU restaurante
export default function PanelAdmin() {
  const { admin, login, logout } = useDatos()
  const [tab, setTab] = useState('reservas')
  if (!admin) return <LoginAdmin login={login} />
  const resto = getRestaurante(admin.restauranteId)

  return (
    <div className="fade">
      <div className="admin__head">
        <div>
          <p className="eyebrow">Panel del restaurante</p>
          <h1 className="admin__titulo">{resto.nombre}</h1>
          <p className="muted">{resto.tipo} · {resto.distrito} · {resto.mesas.length} mesas · <Link className="link" to={`/restaurantes/${resto.id}`}>ver como comensal</Link></p>
        </div>
        <div className="usuario usuario--claro">
          <span className="usuario__av">{admin.nombre.split(' ').map((p) => p[0]).join('')}</span>
          <span className="usuario__txt"><b>{admin.nombre}</b><small>{admin.usuario}</small></span>
          <button className="btn btn--ghost btn--sm" onClick={logout}>Salir</button>
        </div>
      </div>
      <div className="tabs-sec" role="tablist">
        {TABS.map(([k, t]) => <button key={k} role="tab" aria-selected={tab === k} className={`tab-sec ${tab === k ? 'is-act' : ''}`} onClick={() => setTab(k)}>{t}</button>)}
      </div>
      <div key={tab} className="fade">
        {tab === 'reservas' && <AdminReservas resto={resto} />}
        {tab === 'carta' && <AdminCarta resto={resto} />}
        {tab === 'promos' && <AdminPromociones resto={resto} />}
        {tab === 'reportes' && <AdminReportes resto={resto} />}
      </div>
    </div>
  )
}
