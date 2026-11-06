import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { generarReservas } from '../data/semilla'
import { seSolapan } from '../utils/fechas'

export function useReservas() {
  const [reservas, setReservas] = useLocalStorage('tumesalista.reservas.v3', generarReservas)
  const activas = reservas.filter((r) => r.estado !== 'cancelada')

  const crear = useCallback((datos) => {
    if (activas.some((r) => seSolapan(r, datos))) return { ok: false, error: 'Esa mesa ya está ocupada en ese horario.' }
    // Un mismo DNI no puede tener dos reservas que se crucen en el mismo restaurante
    const dup = activas.some((r) => r.dni === datos.dni && seSolapan({ ...r, mesaId: 0 }, { ...datos, mesaId: 0 }))
    if (dup) return { ok: false, error: 'Ya tienes una reserva en este restaurante a esa hora.' }
    const nueva = { ...datos, id: String(Date.now()), estado: 'pendiente' }
    setReservas((prev) => [...prev, nueva])
    return { ok: true, reserva: nueva }
  }, [activas, setReservas])

  const cambiarEstado = (id, estado) => setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, estado } : r)))
  const eliminar = (id) => setReservas((prev) => prev.filter((r) => r.id !== id))
  const reiniciar = () => setReservas(generarReservas())

  return { reservas, activas, crear, cambiarEstado, eliminar, reiniciar }
}
