import { Link } from 'react-router-dom'

const SERVICIOS = [
  ['Reservas en línea', 'Tus clientes reservan 24/7 desde el celular. Sin llamadas ni cuadernos.'],
  ['Cero cruces de horario', 'El sistema bloquea mesas ocupadas y evita reservas duplicadas por DNI.'],
  ['Carta y promociones', 'Publica tus platos, precios y promociones; cámbialos cuando quieras.'],
  ['Panel por restaurante', 'Cada restaurante tiene su propio usuario y solo ve su información.'],
  ['Reportes', 'Días con más reservas, horas pico y qué mesas se piden más.'],
  ['Funciona en todo', 'Diseño adaptable a celular, tablet y computadora.'],
]

export default function Servicios() {
  return (
    <div className="fade">
      <div className="hero">
        <p className="eyebrow">Para restaurantes</p>
        <h1>Tu salón, <em>organizado.</em></h1>
        <p className="muted">tumesalista.pe es una solución tecnológica para gestionar reservas, carta y reportes desde un solo lugar.</p>
      </div>
      <div className="grid-servicios">
        {SERVICIOS.map(([t, d], i) => (
          <div key={t} className={`card servicio servicio--${i % 4}`}><h3>{t}</h3><p>{d}</p></div>
        ))}
      </div>
      <div className="card cta-band">
        <div><h3 className="h3">¿Ya eres restaurante afiliado?</h3><p className="muted">Ingresa con el usuario que te asignamos.</p></div>
        <Link to="/admin" className="btn">Acceso restaurantes</Link>
      </div>
    </div>
  )
}
