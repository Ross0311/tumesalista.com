import { getRestaurante } from '../../data/restaurantes'
import { formatoLargo } from '../../utils/fechas'
import { REGLAS } from '../../utils/reglas'

// Vista previa del WhatsApp de reconfirmación (simulado: en producción lo enviaría el servidor)
export default function MensajeSimulado({ reserva, onResponder }) {
  const resto = getRestaurante(reserva.restauranteId)
  const respondida = reserva.estado !== 'pendiente'
  return (
    <div className="wsp">
      <div className="wsp__top"><span className="wsp__av">t</span><div><b>tumesalista.pe</b><small>Recordatorio · {REGLAS.RECORDATORIO_HORAS} h antes</small></div></div>
      <div className="wsp__chat">
        <div className="wsp__burbuja">
          Hola {reserva.nombres.split(' ')[0]} 👋 Te recordamos tu reserva en <b>{resto.nombre}</b> hoy, {formatoLargo(reserva.fecha).toLowerCase()}, a las <b>{reserva.hora}</b> (Mesa {reserva.mesaId}, {reserva.personas} pers.).
          <br /><br />¿Vienes? Si no respondes, el restaurante podrá liberar tu mesa.
          <span className="wsp__hora">{reserva.hora.replace(/^(\d+)/, (h) => String(Math.max(0, h - REGLAS.RECORDATORIO_HORAS)).padStart(2, '0'))}</span>
        </div>
        {!respondida ? (
          <div className="wsp__botones">
            <button onClick={() => onResponder('confirmada')}>✓ Confirmo</button>
            <button onClick={() => onResponder('cancelada')}>✕ Cancelo</button>
          </div>
        ) : (
          <div className="wsp__burbuja wsp__burbuja--yo">
            {reserva.estado === 'confirmada' ? '✓ Confirmo' : '✕ Cancelo'}
            <span className="wsp__hora">✓✓</span>
          </div>
        )}
        {respondida && (
          <div className="wsp__burbuja">
            {reserva.estado === 'confirmada'
              ? `¡Gracias! Tu mesa está confirmada. Recuerda: te esperamos hasta ${REGLAS.TOLERANCIA_MIN} minutos después de la hora.`
              : 'Listo, cancelamos tu reserva y liberamos la mesa. ¡Gracias por avisar!'}
          </div>
        )}
      </div>
    </div>
  )
}
