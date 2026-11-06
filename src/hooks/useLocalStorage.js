import { useState, useEffect } from 'react'

// Hook reutilizable: estado que se guarda en localStorage y se sincroniza entre pestañas
export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave)
      if (guardado) return JSON.parse(guardado)
    } catch { /* sin almacenamiento */ }
    return typeof valorInicial === 'function' ? valorInicial() : valorInicial
  })

  useEffect(() => {
    try { localStorage.setItem(clave, JSON.stringify(valor)) } catch { /* sin almacenamiento */ }
  }, [clave, valor])

  useEffect(() => {
    const alCambiar = (e) => { if (e.key === clave && e.newValue) setValor(JSON.parse(e.newValue)) }
    window.addEventListener('storage', alCambiar)
    return () => window.removeEventListener('storage', alCambiar)
  }, [clave])

  return [valor, setValor]
}
