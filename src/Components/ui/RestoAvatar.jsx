const OSCUROS = ['#8E1825', '#3D2722']

// Miniatura del restaurante con sus iniciales sobre rayas (estilo toldo)
export default function RestoAvatar({ resto, size = 72 }) {
  const iniciales = resto.nombre.split(' ').map((p) => p[0]).filter((l) => /[A-Z]/.test(l)).slice(0, 2).join('')
  return (
    <span className="resto__img" style={{ background: resto.color, color: OSCUROS.includes(resto.color) ? '#fff' : '#3D2722', width: size, height: size, fontSize: size * 0.42 }}>
      {iniciales}
    </span>
  )
}
