import { DURACION_MIN } from '../data/restaurantes'

export const aMinutos = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m }
export const isoDia = (d) => {
  const x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 10)
}
export const hoyISO = () => isoDia(new Date())
export const sumarDias = (iso, n) => isoDia(new Date(iso + 'T12:00').getTime() + n * 864e5)
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1)
export const formatoLargo = (iso) =>
  cap(new Date(iso + 'T12:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }))
export const formatoCorto = (iso) =>
  new Date(iso + 'T12:00').toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' })

// Dos reservas chocan si es el mismo restaurante, la misma mesa, el mismo día y los 90 min se cruzan
export const seSolapan = (a, b) =>
  a.restauranteId === b.restauranteId && a.mesaId === b.mesaId && a.fecha === b.fecha &&
  Math.abs(aMinutos(a.hora) - aMinutos(b.hora)) < DURACION_MIN

export const soles = (n) => `S/ ${Number(n).toFixed(2)}`
