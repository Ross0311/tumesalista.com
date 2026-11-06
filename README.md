# tumesalista.pe 🍽️

Plataforma web de **reservas de mesas para varios restaurantes**, con **carta digital, promociones y reportes**. Hecha con **React (Create React App) + react-router-dom**.

## Funcionalidades

### Comensal (sin cuenta)
- **Restaurantes y cartas:** ve la carta de cada restaurante (platos y precios) y sus promociones. La carta es **solo referencial**: no se piden platos, solo se reserva mesa.
- **Reservar** en 4 pasos: restaurante → fecha y hora → mesa → datos (**DNI, nombres, apellidos, celular, correo**), con validación de cada campo.
- **Contacto por restaurante:** cada restaurante muestra su dirección, teléfono, WhatsApp, correo y horario, y tiene un formulario para escribirle.

### Usuario del restaurante (con usuario y contraseña)
Cada usuario administra **solo su restaurante**. Su panel tiene:
| Pestaña | Qué hace |
|---|---|
| Reservas | Calendario, ocupación del día, confirmar / marcar llegada / cancelar |
| Carta y precios | Agregar, editar, eliminar o marcar como agotado cada plato |
| Promociones | Crear, editar, pausar o eliminar promociones con fecha de vigencia |
| Reportes | Fechas con más reservas, horas pico, reservas por día de la semana y por mes, **tipo de mesa** (para 2, para 4, familiar) y tamaño de los grupos. Filtro: 30 días / 3 meses / todo |

| Usuario | Contraseña | Restaurante |
|---|---|---|
| admin.nonna | nonna123 | La Nonna Trattoria |
| admin.norteno | norte123 | Sabor Norteño |
| admin.sakura | sakura123 | Sakura Nikkei |
| admin.brasa | brasa123 | Brasa & Leña |

> Datos de demostración en `src/data/`. Las reservas, cartas y promociones se guardan en `localStorage`. Al iniciar se genera un historial de ~5 meses para que los reportes tengan datos. En producción todo esto iría en un backend con contraseñas cifradas.

**Reglas para evitar conflictos:** una reserva ocupa la mesa 90 min. No se aceptan dos reservas del mismo restaurante, la misma mesa y el mismo día cuyos horarios se crucen, ni dos reservas del mismo DNI que se crucen en el mismo restaurante.

## Instalación
Requisitos: Node.js 18+ y npm.
```bash
npm install
npm install react-router-dom      # si aún no está instalado
npm start                          # abre http://localhost:3000
```
`npm run build` genera la versión de producción.

## Rutas
| Ruta | Página |
|---|---|
| `/` | Inicio (cómo funciona, restaurantes, promociones vigentes) |
| `/restaurantes` | Lista de restaurantes con filtro por tipo de cocina |
| `/restaurantes/:id` | Carta, promociones y contacto del restaurante |
| `/reservar` (`?r=id`) | Reserva en 4 pasos |
| `/servicios` | Qué ofrece la plataforma a los restaurantes |
| `/contacto` | Contacto de cada restaurante |
| `/admin` | Login → panel del restaurante |

Se usa `HashRouter` (las URLs llevan `#/`) para que la app funcione en cualquier hosting, como GitHub Pages, sin configuración extra.

## Estructura
```
src/
├── index.js / index.css
├── App.js                      # rutas
├── App.css                     # estilos y paleta
├── context/DatosContext.js     # useContext: reservas, cartas, sesión y avisos
├── hooks/
│   ├── useLocalStorage.js      # hook genérico (useState + useEffect)
│   ├── useReservas.js
│   ├── useCartas.js            # platos y promociones
│   └── useSesion.js
├── data/restaurantes.js        # restaurantes, admins, cartas y promociones iniciales
├── data/semilla.js             # historial de reservas para los reportes
├── utils/fechas.js
└── Components/
    ├── Navegacion.jsx  Footer.jsx  Inicio.jsx  Servicios.jsx  Contacto.jsx
    ├── Restaurantes.jsx  RestauranteDetalle.jsx  Reservar.jsx
    ├── admin/   LoginAdmin  PanelAdmin  AdminReservas  AdminCarta  AdminPromociones  AdminReportes
    ├── carta/   CartaMenu  PromoCard
    ├── reserva/ Calendario  SelectorHorario  MapaMesas  SelectorRestaurante  ListaReservas  Toast
    └── ui/      Logo  RestoAvatar  FichaContacto
```

## Hooks
| Hook | Uso |
|---|---|
| `useState` | estado de formularios, pasos, pestañas, filtros, menú móvil |
| `useEffect` | persistencia en localStorage, sincronización entre pestañas, cerrar menú y subir al cambiar de ruta, limpiar hora/mesa no disponibles |
| `useMemo` | cálculos de disponibilidad y reportes |
| `useContext` | compartir datos entre páginas (`DatosContext`) |
| Hooks propios | `useLocalStorage`, `useReservas`, `useCartas`, `useSesion` |
| Router | `useParams`, `useSearchParams`, `useLocation` |

## Paleta
Cherry Red `#8E1825` · Columbia Blue `#C8D9EC` · Butter Yellow `#FFEDAD` · Dark Chocolate `#3D2722`. Tipografías: Dancing Script e Inter.

## Integrantes
- Nombre 1 — rol
- Nombre 2 — rol
- Nombre 3 — rol
