import { useState, useEffect } from 'react'
import { ADMINS } from '../data/restaurantes'

const CLAVE = 'tumesalista.sesion'

// Sesión del usuario del restaurante: se guarda solo el usuario, nunca la contraseña
export function useSesion() {
  const [admin, setAdmin] = useState(() => {
    try { const u = sessionStorage.getItem(CLAVE); return ADMINS.find((a) => a.usuario === u) ?? null } catch { return null }
  })

  useEffect(() => {
    try { admin ? sessionStorage.setItem(CLAVE, admin.usuario) : sessionStorage.removeItem(CLAVE) } catch { /* noop */ }
  }, [admin])

  const login = (usuario, clave) => {
    const a = ADMINS.find((x) => x.usuario === usuario.trim().toLowerCase() && x.clave === clave)
    if (!a) return 'Usuario o contraseña incorrectos.'
    setAdmin(a)
    return null
  }
  return { admin, login, logout: () => setAdmin(null) }
}
