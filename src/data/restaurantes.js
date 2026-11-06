// Restaurantes afiliados a tumesalista.pe (datos de demostración)
const mesas = (lista) => lista.map(([capacidad, zona], i) => ({ id: i + 1, nombre: `Mesa ${i + 1}`, capacidad, zona }))

export const RESTAURANTES = [
  {
    id: 'nonna', nombre: 'La Nonna Trattoria', tipo: 'Italiana', distrito: 'Miraflores', color: '#8E1825',
    descripcion: 'Pastas frescas y pizzas a la leña.',
    direccion: 'Av. Larco 812, Miraflores', telefono: '01 445 1290', whatsapp: '987 112 334', correo: 'reservas@lanonna.pe',
    horario: 'Lun a Dom · 12:00 – 23:00', redes: '@lanonna.pe',
    mesas: mesas([[2, 'Ventana'], [2, 'Ventana'], [4, 'Salón'], [4, 'Salón'], [4, 'Salón'], [6, 'Terraza'], [6, 'Terraza'], [8, 'Privado']]),
  },
  {
    id: 'norteno', nombre: 'Sabor Norteño', tipo: 'Criolla', distrito: 'Barranco', color: '#3D2722',
    descripcion: 'Cabrito, arroz con pato y ceviche de mero.',
    direccion: 'Jr. Grau 245, Barranco', telefono: '01 247 3388', whatsapp: '955 410 220', correo: 'hola@sabornorteno.pe',
    horario: 'Mar a Dom · 12:00 – 22:30', redes: '@sabornorteno',
    mesas: mesas([[2, 'Barra'], [4, 'Salón'], [4, 'Salón'], [6, 'Salón'], [6, 'Patio'], [10, 'Patio']]),
  },
  {
    id: 'sakura', nombre: 'Sakura Nikkei', tipo: 'Nikkei', distrito: 'San Isidro', color: '#C8D9EC',
    descripcion: 'Makis, tiraditos y cocina fusión.',
    direccion: 'Calle Las Begonias 430, San Isidro', telefono: '01 421 6070', whatsapp: '944 870 115', correo: 'contacto@sakuranikkei.pe',
    horario: 'Lun a Sáb · 12:30 – 23:00', redes: '@sakura.nikkei',
    mesas: mesas([[2, 'Barra sushi'], [2, 'Barra sushi'], [2, 'Barra sushi'], [4, 'Salón'], [4, 'Salón'], [6, 'Privado']]),
  },
  {
    id: 'brasa', nombre: 'Brasa & Leña', tipo: 'Parrillas', distrito: 'Surco', color: '#FFEDAD',
    descripcion: 'Cortes a la parrilla y pollo a la brasa.',
    direccion: 'Av. Primavera 1550, Surco', telefono: '01 372 9014', whatsapp: '966 302 781', correo: 'reservas@brasaylena.pe',
    horario: 'Lun a Dom · 12:00 – 23:30', redes: '@brasaylena',
    mesas: mesas([[4, 'Salón'], [4, 'Salón'], [4, 'Salón'], [6, 'Terraza'], [6, 'Terraza'], [8, 'Terraza'], [12, 'Familiar']]),
  },
]

// Cada usuario administra un solo restaurante (en producción: backend con contraseñas cifradas)
export const ADMINS = [
  { usuario: 'admin.nonna', clave: 'nonna123', nombre: 'Giulia Rossi', restauranteId: 'nonna' },
  { usuario: 'admin.norteno', clave: 'norte123', nombre: 'Martín Aguilar', restauranteId: 'norteno' },
  { usuario: 'admin.sakura', clave: 'sakura123', nombre: 'Kenji Tanaka', restauranteId: 'sakura' },
  { usuario: 'admin.brasa', clave: 'brasa123', nombre: 'Rocío Vargas', restauranteId: 'brasa' },
]

export const CATEGORIAS = ['Entradas', 'Platos de fondo', 'Postres', 'Bebidas']

const p = (id, categoria, nombre, descripcion, precio) => ({ id, categoria, nombre, descripcion, precio, disponible: true })
export const CARTAS_INICIALES = {
  nonna: [
    p('n1', 'Entradas', 'Bruschetta clásica', 'Pan de masa madre, tomate, albahaca y aceite de oliva.', 22),
    p('n2', 'Entradas', 'Burrata con pesto', 'Burrata cremosa, tomates cherry y pesto de la casa.', 38),
    p('n3', 'Platos de fondo', 'Fettuccine Alfredo', 'Pasta fresca en salsa de mantequilla y parmesano.', 46),
    p('n4', 'Platos de fondo', 'Pizza Margherita', 'Masa a la leña, mozzarella fior di latte y albahaca.', 42),
    p('n5', 'Platos de fondo', 'Lasagna de la Nonna', 'Ragú de carne cocido 6 horas y bechamel.', 52),
    p('n6', 'Postres', 'Tiramisú', 'Receta tradicional con café y mascarpone.', 24),
    p('n7', 'Bebidas', 'Limonada de hierbabuena', 'Jarra de 1 litro.', 18),
  ],
  norteno: [
    p('s1', 'Entradas', 'Ceviche de mero', 'Leche de tigre, camote glaseado y choclo.', 48),
    p('s2', 'Entradas', 'Causa de cangrejo', 'Papa amarilla, palta y pulpa de cangrejo.', 34),
    p('s3', 'Platos de fondo', 'Seco de cabrito', 'Con frejoles a la norteña y arroz.', 56),
    p('s4', 'Platos de fondo', 'Arroz con pato', 'Pato confitado y arroz verde al culantro.', 54),
    p('s5', 'Postres', 'King Kong de manjar', 'Galleta, manjar blanco y dulce de piña.', 16),
    p('s6', 'Bebidas', 'Chicha morada', 'Jarra de 1 litro.', 16),
  ],
  sakura: [
    p('k1', 'Entradas', 'Gyozas de cerdo', '6 unidades con salsa ponzu.', 28),
    p('k2', 'Entradas', 'Tiradito nikkei', 'Pesca del día, salsa acevichada y ajonjolí.', 42),
    p('k3', 'Platos de fondo', 'Maki acevichado', '10 cortes de langostino y palta.', 39),
    p('k4', 'Platos de fondo', 'Ramen tonkotsu', 'Caldo de cerdo, chashu y huevo marinado.', 45),
    p('k5', 'Postres', 'Mochi de lúcuma', '3 unidades.', 20),
    p('k6', 'Bebidas', 'Té verde helado', 'Vaso de 500 ml.', 12),
  ],
  brasa: [
    p('b1', 'Entradas', 'Anticuchos de corazón', 'Con papa dorada y choclo.', 32),
    p('b2', 'Entradas', 'Chorizo parrillero', 'Con chimichurri de la casa.', 26),
    p('b3', 'Platos de fondo', 'Pollo a la brasa (1/4)', 'Papas fritas y ensalada.', 29),
    p('b4', 'Platos de fondo', 'Bife de chorizo 400 g', 'Con guarnición a elección.', 79),
    p('b5', 'Platos de fondo', 'Parrilla familiar', 'Para 4: cortes, chorizo, pollo y guarniciones.', 189),
    p('b6', 'Postres', 'Suspiro limeño', 'Clásico de la casa.', 18),
    p('b7', 'Bebidas', 'Jarra de maracuyá', '1 litro.', 18),
  ],
}

const enDias = (d) => { const x = new Date(Date.now() + d * 864e5); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 10) }
export const PROMOS_INICIALES = {
  nonna: [
    { id: 'pn1', titulo: 'Martes de pasta', descripcion: 'Todas las pastas con descuento.', etiqueta: '-20%', dias: 'Martes', hasta: enDias(45), activa: true },
    { id: 'pn2', titulo: 'Pizza 2x1', descripcion: 'En pizzas clásicas, solo en salón.', etiqueta: '2x1', dias: 'Lunes a jueves', hasta: enDias(20), activa: true },
  ],
  norteno: [
    { id: 'ps1', titulo: 'Almuerzo norteño', descripcion: 'Entrada + fondo + chicha.', etiqueta: 'S/ 45', dias: 'Martes a viernes', hasta: enDias(30), activa: true },
  ],
  sakura: [
    { id: 'pk1', titulo: 'Happy hour de makis', descripcion: 'Segundo maki a mitad de precio de 17:00 a 19:00.', etiqueta: '-50%', dias: 'Lunes a viernes', hasta: enDias(25), activa: true },
  ],
  brasa: [
    { id: 'pb1', titulo: 'Domingo familiar', descripcion: 'Parrilla familiar + jarra gratis.', etiqueta: 'Jarra gratis', dias: 'Domingos', hasta: enDias(60), activa: true },
    { id: 'pb2', titulo: 'Combo pareja', descripcion: '1/2 pollo + papas + 2 bebidas.', etiqueta: 'S/ 59', dias: 'Todos los días', hasta: enDias(15), activa: false },
  ],
}

export const getRestaurante = (id) => RESTAURANTES.find((r) => r.id === id)

export const DURACION_MIN = 90
export const HORARIOS = Array.from({ length: 21 }, (_, i) => {
  const t = 12 * 60 + i * 30
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
})
