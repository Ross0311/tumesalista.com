import { createContext, useContext, useState, useCallback } from 'react'
import { useReservas } from '../hooks/useReservas'
import { useCartas } from '../hooks/useCartas'
import { useSesion } from '../hooks/useSesion'
import { fijarHoraSimulada } from '../utils/reglas'

const DatosContext = createContext(null)

// Comparte reservas, cartas, sesión y notificaciones con toda la app (useContext)
export function DatosProvider({ children }) {
  const reservas = useReservas()
  const cartas = useCartas()
  const sesion = useSesion()
  const [toast, setToast] = useState('')
  const notificar = useCallback((msg) => setToast(msg), [])
  const cerrarToast = useCallback(() => setToast(''), [])
  const [horaSimulada, setHora] = useState(() => {
    let v = null
    try { v = sessionStorage.getItem('tumesalista.hora') } catch { /* noop */ }
    fijarHoraSimulada(v)
    return v
  })
  const simularHora = useCallback((v) => {
    fijarHoraSimulada(v); setHora(v || null)
    try { v ? sessionStorage.setItem('tumesalista.hora', v) : sessionStorage.removeItem('tumesalista.hora') } catch { /* noop */ }
  }, [])

  return (
    <DatosContext.Provider value={{ ...reservas, ...cartas, ...sesion, toast, notificar, cerrarToast, horaSimulada, simularHora }}>
      {children}
    </DatosContext.Provider>
  )
}

export const useDatos = () => useContext(DatosContext)
