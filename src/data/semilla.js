import { RESTAURANTES, HORARIOS } from './restaurantes'
import { hoyISO, sumarDias, seSolapan } from '../utils/fechas'

// Genera un historial de reservas realista (determinístico) para que los reportes tengan datos
const NOMBRES = ['Lucía', 'Carlos', 'Ana', 'Jorge', 'Rosa', 'Pedro', 'Andrea', 'Diego', 'Valeria', 'Miguel', 'Camila', 'Luis', 'Sofía', 'José', 'María', 'Renzo']
const APELLIDOS = ['Torres', 'Quispe', 'Rojas', 'Silva', 'Medina', 'Ramos', 'Paz', 'Flores', 'Castillo', 'Huamán', 'Vargas', 'Chávez', 'Mendoza', 'Salazar']
// Peso por horario: picos de almuerzo (13:00–14:00) y cena (20:00–21:00)
const PESO_HORA = HORARIOS.map((h) => ({ '13:00': 6, '13:30': 7, '14:00': 5, '12:30': 3, '14:30': 3, '19:30': 4, '20:00': 7, '20:30': 6, '21:00': 4 }[h] ?? 1))

function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const elegirPeso = (r, pesos) => { let x = r() * pesos.reduce((a, b) => a + b, 0); return pesos.findIndex((p) => (x -= p) < 0) }

export function generarReservas() {
  const r = rng(2026)
  const hoy = hoyISO()
  const lista = []
  let n = 0
  RESTAURANTES.forEach((resto, ri) => {
    for (let d = -150; d <= 10; d++) {
      const fecha = sumarDias(hoy, d)
      const dow = new Date(fecha + 'T12:00').getDay() // 0 dom, 5 vie, 6 sáb
      const base = dow === 5 || dow === 6 ? 7 : dow === 0 ? 6 : dow === 1 ? 2 : 3
      const total = Math.max(0, Math.round(base + ri - 1 + (r() * 3 - 1) + (d > 0 ? -2 : 0)))
      for (let i = 0; i < total; i++) {
        const hora = HORARIOS[elegirPeso(r, PESO_HORA)]
        const tipo = elegirPeso(r, dow === 0 ? [3, 3, 4] : [5, 3, 2])
        const personas = tipo === 0 ? (r() < 0.8 ? 2 : 1) : tipo === 1 ? 3 + Math.round(r()) : 5 + Math.floor(r() * 4)
        const mesa = resto.mesas.filter((m) => m.capacidad >= personas).sort((a, b) => a.capacidad - b.capacidad)
          .find((m) => !lista.some((x) => seSolapan(x, { restauranteId: resto.id, mesaId: m.id, fecha, hora })))
        if (!mesa) continue
        const pasado = fecha < hoy
        const estado = pasado ? (r() < 0.1 ? 'cancelada' : 'atendida') : r() < 0.6 ? 'confirmada' : 'pendiente'
        const nom = NOMBRES[Math.floor(r() * NOMBRES.length)]
        lista.push({
          id: `h${n++}`, restauranteId: resto.id, fecha, hora, mesaId: mesa.id, personas, estado,
          dni: String(40000000 + Math.floor(r() * 39999999)), nombres: nom,
          apellidos: `${APELLIDOS[Math.floor(r() * APELLIDOS.length)]} ${APELLIDOS[Math.floor(r() * APELLIDOS.length)]}`,
          celular: '9' + String(Math.floor(r() * 1e8)).padStart(8, '0'), correo: `${nom.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}${n}@correo.pe`,
        })
      }
    }
  })
  return lista
}
