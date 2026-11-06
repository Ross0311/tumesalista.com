import { createContext, useContext, useState, useCallback } from 'react'
import { useReservas } from '../hooks/useReservas'
import { useCartas } from '../hooks/useCartas'
import { useSesion } from '../hooks/useSesion'

const DatosContext = createContext(null)

// Comparte reservas, cartas, sesión y notificaciones con toda la app (useContext)
export function DatosProvider({ children }) {
  const reservas = useReservas()
  const cartas = useCartas()
  const sesion = useSesion()
  const [toast, setToast] = useState('')
  const notificar = useCallback((msg) => setToast(msg), [])
  const cerrarToast = useCallback(() => setToast(''), [])

  return (
    <DatosContext.Provider value={{ ...reservas, ...cartas, ...sesion, toast, notificar, cerrarToast }}>
      {children}
    </DatosContext.Provider>
  )
}

export const useDatos = () => useContext(DatosContext)
