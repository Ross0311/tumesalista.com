import { aMinutos, hoyISO, sumarDias } from './fechas'

// Políticas contra reservas falsas e inasistencias
export const REGLAS = {
  RECORDATORIO_HORAS: 2,      // el mensaje de reconfirmación sale 2 h antes
  TOLERANCIA_MIN: 15,         // minutos de espera antes de marcar "No asistió"
  MAX_INASISTENCIAS: 2,       // con 2 inasistencias el DNI se bloquea
  DIAS_BLOQUEO: 30,           // duración del bloqueo
  MAX_ACTIVAS_POR_DNI: 3,     // reservas futuras activas por DNI
  PERSONAS_GARANTIA: 6,       // grupos desde 6 personas dejan garantía
  MONTO_GARANTIA: 20,         // S/ (se descuenta de la cuenta)
}

export const ESTADOS_LIBRES = ['cancelada', 'no_asistio'] // no ocupan mesa

// Modo demostración: permite simular la hora actual para mostrar los estados en clase
let horaSimulada = null
export const fijarHoraSimulada = (hhmm) => { horaSimulada = hhmm || null }
const minutoActual = () => { if (horaSimulada) return aMinutos(horaSimulada); const d = new Date(); return d.getHours() * 60 + d.getMinutes() }

// Minutos que faltan para la reserva (negativo si ya pasó la hora)
export const minutosPara = (r) => {
  const dias = Math.round((new Date(r.fecha + 'T12:00') - new Date(hoyISO() + 'T12:00')) / 864e5)
  return dias * 1440 + aMinutos(r.hora) - minutoActual()
}

// Pendiente de reconfirmar y ya dentro de las 2 h previas: el restaurante puede liberar la mesa
export const sinRespuesta = (r) => r.estado === 'pendiente' && minutosPara(r) <= REGLAS.RECORDATORIO_HORAS * 60

// Pasó la tolerancia: el restaurante puede marcar "No asistió"
export const toleranciaVencida = (r) => ['pendiente', 'confirmada'].includes(r.estado) && minutosPara(r) <= -REGLAS.TOLERANCIA_MIN

// Estado del DNI: inasistencias recientes y bloqueo
export function estadoDni(dni, reservas) {
  const faltas = reservas.filter((r) => r.dni === dni && r.estado === 'no_asistio').sort((a, b) => b.fecha.localeCompare(a.fecha))
  const recientes = faltas.filter((r) => r.fecha >= sumarDias(hoyISO(), -90))
  if (recientes.length >= REGLAS.MAX_INASISTENCIAS) {
    const hasta = sumarDias(recientes[0].fecha, REGLAS.DIAS_BLOQUEO)
    if (hasta >= hoyISO()) return { bloqueado: true, hasta, faltas: recientes.length }
  }
  return { bloqueado: false, faltas: recientes.length }
}

export const requiereGarantia = (personas) => personas >= REGLAS.PERSONAS_GARANTIA
