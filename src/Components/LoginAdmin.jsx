import { useState } from 'react'
import Logo from './reserva/Logo'
import { ADMINS, getRestaurante } from '../data/restaurantes'

export default function LoginAdmin({ login }) {
  const [usuario, setUsuario] = useState('')
  const [clave, setClave] = useState('')
  const [error, setError] = useState('')
  const [ver, setVer] = useState(false)

  const enviar = (e) => { e.preventDefault(); setError(login(usuario, clave) ?? '') }

  return (
    <div className="login fade">
      <form className="card login__card" onSubmit={enviar}>
        <Logo />
        <h2 className="h2">Acceso para restaurantes</h2>
        <p className="muted">Ingresa con el usuario asignado a tu restaurante.</p>
        <label className="lbl" htmlFor="usr">Usuario</label>
        <input id="usr" className="input" value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="admin.restaurante" autoComplete="username" />
        <label className="lbl" htmlFor="pwd">Contraseña</label>
        <div className="pwd">
          <input id="pwd" className="input" type={ver ? 'text' : 'password'} value={clave} onChange={(e) => setClave(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          <button type="button" className="pwd__ver" onClick={() => setVer(!ver)}>{ver ? 'Ocultar' : 'Ver'}</button>
        </div>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn btn--full" disabled={!usuario || !clave}>Ingresar</button>
      </form>
      <aside className="card demo">
        <h4>Usuarios de prueba</h4>
        <ul>
          {ADMINS.map((a) => (
            <li key={a.usuario}>
              <button type="button" className="demo__btn" onClick={() => { setUsuario(a.usuario); setClave(a.clave); setError('') }}>
                <span><b>{a.usuario}</b> · {a.clave}</span><span className="muted">{getRestaurante(a.restauranteId).nombre}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
