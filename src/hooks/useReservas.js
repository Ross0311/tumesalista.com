import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { generarReservas } from '../data/semilla'
import { seSolapan, hoyISO } from '../utils/fechas'
import { REGLAS, ESTADOS_LIBRES, estadoDni } from '../utils/reglas'

export function useReservas() {
  const [reservas, setReservas] = useLocalStorage('tumesalista.reservas.v4', generarReservas)
  // Las canceladas y las inasistencias liberan la mesa
  const activas = reservas.filter((r) => !ESTADOS_LIBRES.includes(r.estado))

  const crear = useCallback((datos) => {
    const bloqueo = estadoDni(datos.dni, reservas)
    if (bloqueo.bloqueado) return { ok: false, error: `Este DNI tiene ${bloqueo.faltas} inasistencias recientes y no puede reservar hasta el ${bloqueo.hasta.split('-').reverse().join('/')}.` }
    const futuras = activas.filter((r) => r.dni === datos.dni && r.fecha >= hoyISO())
    if (futuras.length >= REGLAS.MAX_ACTIVAS_POR_DNI) return { ok: false, error: `Ya tienes ${futuras.length} reservas activas. Cancela alguna en "Mis reservas" para hacer otra.` }
    if (futuras.some((r) => r.restauranteId === datos.restauranteId && r.fecha === datos.fecha)) return { ok: false, error: 'Ya tienes una reserva en este restaurante para ese día.' }
    if (activas.some((r) => seSolapan(r, datos))) return { ok: false, error: 'Esa mesa ya está ocupada en ese horario.' }
    const nueva = { ...datos, id: String(Date.now()), estado: 'pendiente' }
    setReservas((prev) => [...prev, nueva])
    return { ok: true, reserva: nueva }
  }, [activas, reservas, setReservas])

  const cambiarEstado = (id, estado) => setReservas((prev) => prev.map((r) => (r.id === id ? { ...r, estado } : r)))
  const eliminar = (id) => setReservas((prev) => prev.filter((r) => r.id !== id))
  const reiniciar = () => setReservas(generarReservas())

  return { reservas, activas, crear, cambiarEstado, eliminar, reiniciar }
}
