import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { DatosProvider, useDatos } from './context/DatosContext'
import Navegacion from './Components/Navegacion'
import Footer from './Components/Footer'
import Inicio from './Components/Inicio'
import Restaurantes from './Components/Restaurantes'
import RestauranteDetalle from './Components/RestauranteDetalle'
import Reservar from './Components/Reservar'
import Servicios from './Components/Servicios'
import Contacto from './Components/Contacto'
import PanelAdmin from './Components/admin/PanelAdmin'
import Toast from './Components/reserva/Toast'

function Notificaciones() {
  const { toast, cerrarToast } = useDatos()
  return <Toast mensaje={toast} onClose={cerrarToast} />
}

export default function App() {
  return (
    <DatosProvider>
      <HashRouter>
        <Navegacion />
        <main className="main">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/restaurantes" element={<Restaurantes />} />
            <Route path="/restaurantes/:id" element={<RestauranteDetalle />} />
            <Route path="/reservar" element={<Reservar />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/admin" element={<PanelAdmin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <Notificaciones />
      </HashRouter>
    </DatosProvider>
  )
}
