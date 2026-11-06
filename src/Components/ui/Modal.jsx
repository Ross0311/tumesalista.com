import { useEffect, useRef } from 'react'

// Ventana emergente reutilizable: se cierra con Escape o clic fuera y bloquea el scroll de fondo
export default function Modal({ abierto, titulo, onCerrar, children, acciones }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!abierto) return
    const alTeclear = (e) => { if (e.key === 'Escape') onCerrar() }
    document.addEventListener('keydown', alTeclear)
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    return () => { document.removeEventListener('keydown', alTeclear); document.body.style.overflow = '' }
  }, [abierto, onCerrar])

  if (!abierto) return null
  return (
    <div className="modal__fondo" onMouseDown={(e) => { if (e.target === e.currentTarget) onCerrar() }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo" tabIndex={-1} ref={ref}>
        <button className="modal__x" onClick={onCerrar} aria-label="Cerrar">×</button>
        <h2 id="modal-titulo" className="modal__titulo">{titulo}</h2>
        <div className="modal__cuerpo">{children}</div>
        {acciones && <div className="modal__acciones">{acciones}</div>}
      </div>
    </div>
  )
}
