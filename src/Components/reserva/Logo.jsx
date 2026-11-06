export default function Logo({ claro = false }) {
  return (
    <div className={`logo ${claro ? 'logo--claro' : ''}`}>
      <span className="logo__script">tumesalista</span>
      <span className="logo__dom">.pe</span>
    </div>
  )
}
