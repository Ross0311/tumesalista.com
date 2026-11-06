import { useLocalStorage } from './useLocalStorage'
import { CARTAS_INICIALES, PROMOS_INICIALES } from '../data/restaurantes'
import { hoyISO } from '../utils/fechas'

const nuevoId = () => Math.random().toString(36).slice(2, 9)

// Carta (platos y precios) y promociones de cada restaurante
export function useCartas() {
  const [platos, setPlatos] = useLocalStorage('tumesalista.platos.v1', CARTAS_INICIALES)
  const [promos, setPromos] = useLocalStorage('tumesalista.promos.v1', PROMOS_INICIALES)

  const guardarEn = (setter) => (restId, item) => setter((prev) => {
    const lista = prev[restId] ?? []
    const existe = item.id && lista.some((x) => x.id === item.id)
    return { ...prev, [restId]: existe ? lista.map((x) => (x.id === item.id ? item : x)) : [...lista, { ...item, id: nuevoId() }] }
  })
  const quitarDe = (setter) => (restId, id) => setter((prev) => ({ ...prev, [restId]: (prev[restId] ?? []).filter((x) => x.id !== id) }))

  return {
    platosDe: (id) => platos[id] ?? [],
    promosDe: (id) => promos[id] ?? [],
    promosVigentes: (id) => (promos[id] ?? []).filter((p) => p.activa && p.hasta >= hoyISO()),
    guardarPlato: guardarEn(setPlatos),
    eliminarPlato: quitarDe(setPlatos),
    guardarPromo: guardarEn(setPromos),
    eliminarPromo: quitarDe(setPromos),
    reiniciarCartas: () => { setPlatos(CARTAS_INICIALES); setPromos(PROMOS_INICIALES) },
  }
}
