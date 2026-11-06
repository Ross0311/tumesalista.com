import { useState, useMemo } from 'react'
import { useDatos } from '../../context/DatosContext'
import { HORARIOS } from '../../data/restaurantes'
import { hoyISO, sumarDias, formatoLargo } from '../../utils/fechas'

const PERIODOS = [['30', 'Últimos 30 días'], ['90', 'Últimos 3 meses'], ['todo', 'Todo el historial']]
const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic']
const TIPOS = [
  ['Mesa para 2', (c) => c <= 2, 'var(--cherry)'],
  ['Mesa para 4', (c) => c > 2 && c <= 4, 'var(--blue-d)'],
  ['Mesa familiar (6+)', (c) => c > 4, 'var(--butter-d)'],
]

function Barras({ datos, destacar = 1, etiqueta = (d) => d.k }) {
  const max = Math.max(1, ...datos.map((d) => d.n))
  const top = [...datos].sort((a, b) => b.n - a.n).slice(0, destacar).map((d) => d.k)
  return (
    <div className="barras barras--rep">
      {datos.map((d) => (
        <div key={d.k} className="barra" title={`${d.k}: ${d.n} reservas`}>
          <b className="barra__val">{d.n || ''}</b>
          <div className="barra__fill" style={{ height: `${(d.n / max) * 100}%` }} data-alta={top.includes(d.k) && d.n > 0} />
          <span>{etiqueta(d)}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminReportes({ resto }) {
  const { reservas } = useDatos()
  const [periodo, setPeriodo] = useState('90')

  const r = useMemo(() => {
    const hoy = hoyISO()
    const desde = periodo === 'todo' ? '0000' : sumarDias(hoy, -Number(periodo))
    const lista = reservas.filter((x) => x.restauranteId === resto.id && x.fecha >= desde && x.fecha <= hoy)
    const validas = lista.filter((x) => x.estado !== 'cancelada')
    const capacidad = (x) => resto.mesas.find((m) => m.id === x.mesaId)?.capacidad ?? x.personas

    const porFecha = {}
    validas.forEach((x) => { porFecha[x.fecha] = (porFecha[x.fecha] || 0) + 1 })
    const topFechas = Object.entries(porFecha).sort((a, b) => b[1] - a[1] || b[0].localeCompare(a[0])).slice(0, 5)

    const porDia = DIAS.map((k) => ({ k, n: 0 }))
    validas.forEach((x) => { porDia[(new Date(x.fecha + 'T12:00').getDay() + 6) % 7].n++ })

    const porHora = HORARIOS.filter((h) => h.endsWith(':00')).map((k) => ({ k, n: 0 }))
    validas.forEach((x) => { const h = porHora.find((p) => p.k.slice(0, 2) === x.hora.slice(0, 2)); if (h) h.n++ })

    const porMes = {}
    validas.forEach((x) => { const k = x.fecha.slice(0, 7); porMes[k] = (porMes[k] || 0) + 1 })
    const meses = Object.entries(porMes).sort().map(([k, n]) => ({ k, n }))

    const tipos = TIPOS.map(([k, fn, color]) => ({ k, color, n: validas.filter((x) => fn(capacidad(x))).length }))
    const grupos = [['1–2 personas', (p) => p <= 2], ['3–4 personas', (p) => p >= 3 && p <= 4], ['5 o más', (p) => p >= 5]]
      .map(([k, fn]) => ({ k, n: validas.filter((x) => fn(x.personas)).length }))

    return {
      total: validas.length, comensales: validas.reduce((s, x) => s + x.personas, 0),
      cancel: lista.length ? Math.round(((lista.length - validas.length) / lista.length) * 100) : 0,
      topFechas, porDia, porHora, meses, tipos, grupos,
      diaTop: [...porDia].sort((a, b) => b.n - a.n)[0], horaTop: [...porHora].sort((a, b) => b.n - a.n)[0],
      tipoTop: [...tipos].sort((a, b) => b.n - a.n)[0],
    }
  }, [reservas, resto, periodo])

  const pct = (n) => (r.total ? Math.round((n / r.total) * 100) : 0)
  let acum = 0
  const dona = r.tipos.map((t) => { const ini = acum; acum += pct(t.n); return `${t.color} ${ini}% ${acum}%` }).join(', ')

  return (
    <div className="reportes">
      <div className="seccion__head">
        <h2 className="h2">Reporte de reservas</h2>
        <div className="filtros">
          {PERIODOS.map(([k, t]) => <button key={k} className={`chip ${periodo === k ? 'is-sel' : ''}`} onClick={() => setPeriodo(k)}>{t}</button>)}
        </div>
      </div>

      <div className="kpis">
        <div className="kpi kpi--red"><span>Reservas</span><b>{r.total}</b></div>
        <div className="kpi kpi--blue"><span>Comensales</span><b>{r.comensales}</b></div>
        <div className="kpi kpi--yellow"><span>Promedio por mesa</span><b>{r.total ? (r.comensales / r.total).toFixed(1) : '—'}</b></div>
        <div className="kpi kpi--choc"><span>Cancelación</span><b>{r.cancel}%</b></div>
      </div>

      {r.total > 0 && (
        <p className="nota insight">
          Tu día más fuerte es el <b>{r.diaTop.k}</b>, la hora pico es a las <b>{r.horaTop.k}</b> y la mesa más pedida es la <b>{r.tipoTop.k.toLowerCase()}</b> ({pct(r.tipoTop.n)}% de las reservas).
        </p>
      )}

      <div className="rep-grid">
        <div className="card">
          <h3 className="h3">Fechas con más reservas</h3>
          <ol className="ranking">
            {r.topFechas.map(([f, n], i) => (
              <li key={f}><span className="ranking__n">{i + 1}</span><span className="ranking__txt">{formatoLargo(f)}</span>
                <span className="ranking__bar"><i style={{ width: `${(n / r.topFechas[0][1]) * 100}%` }} /></span><b>{n}</b></li>
            ))}
          </ol>
        </div>
        <div className="card">
          <h3 className="h3">Tipo de mesa reservada</h3>
          <div className="dona-wrap">
            <div className="dona" style={{ background: `conic-gradient(${dona || 'var(--line) 0 100%'})` }}><span><b>{r.total}</b>reservas</span></div>
            <ul className="leyenda-dona">
              {r.tipos.map((t) => <li key={t.k}><i style={{ background: t.color }} />{t.k}<b>{pct(t.n)}%</b><small className="muted">{t.n}</small></li>)}
            </ul>
          </div>
          <h4 className="lbl">Tamaño de los grupos</h4>
          <div className="grupos">
            {r.grupos.map((g) => <div key={g.k}><span className="muted">{g.k}</span><b>{pct(g.n)}%</b></div>)}
          </div>
        </div>
        <div className="card"><h3 className="h3">Horas pico</h3><Barras datos={r.porHora} destacar={2} etiqueta={(d) => d.k.slice(0, 2) + 'h'} /></div>
        <div className="card"><h3 className="h3">Reservas por día de la semana</h3><Barras datos={r.porDia} destacar={2} /></div>
        <div className="card rep-grid__full"><h3 className="h3">Reservas por mes</h3>
          <Barras datos={r.meses} destacar={1} etiqueta={(d) => `${MESES[Number(d.k.slice(5)) - 1]} ${d.k.slice(2, 4)}`} />
        </div>
      </div>
    </div>
  )
}
