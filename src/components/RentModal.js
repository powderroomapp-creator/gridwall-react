import { useState } from 'react'

const HOT_ZONES = [
  { zone: 'A', label: 'Center Core', demand: 'Very High', available: 4200, marketRate: '$0.25/sq/wk' },
  { zone: 'B', label: 'Mid Ring', demand: 'High', available: 48000, marketRate: '$0.20/sq/wk' },
  { zone: 'C', label: 'Outer Ring', demand: 'Moderate', available: 182000, marketRate: '$0.15/sq/wk' },
]

const PAST_RENTALS = [
  { renter: 'PurpleDAO', zone: 'A', squares: 340, weeks: 4, total: '$340', end: '2 days ago' },
  { renter: 'NightOwl Studio', zone: 'B', squares: 500, weeks: 2, total: '$200', end: '5 days ago' },
  { renter: 'FRESH KICKS CO', zone: 'A', squares: 180, weeks: 1, total: '$45', end: '1 wk ago' },
  { renter: 'moondust', zone: 'C', squares: 1200, weeks: 4, total: '$720', end: '2 wks ago' },
  { renter: 'wallstreetpx', zone: 'B', squares: 220, weeks: 2, total: '$88', end: '3 wks ago' },
  { renter: 'gridmaxi', zone: 'A', squares: 600, weeks: 8, total: '$1,200', end: '1 mo ago' },
]

export default function RentModal({ onClose }) {
  const [tab, setTab] = useState('market')
  const [zone, setZone] = useState('a')
  const [squares, setSquares] = useState(300)
  const [weeks, setWeeks] = useState(1)

  const ratePerSq = zone==='a' ? 0.25 : zone==='b' ? 0.20 : 0.15
  const total = (squares * ratePerSq * weeks).toFixed(2)

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth:560 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
          <div className="modal-title" style={{marginBottom:0}}>Rent squares.</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#555', fontSize:'1.2rem', cursor:'pointer' }}>✕</button>
        </div>
        <div style={{ display:'flex', marginBottom:'1.5rem', border:'1px solid rgba(255,255,255,0.12)' }}>
          {[['market','Market'],['past','Past Rentals']].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex:1, padding:'0.65rem', background:tab===id?'#fff':'transparent', color:tab===id?'#000':'#9e9e9e', border:'none', fontFamily:'Space Mono,monospace', fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.08em', cursor:'pointer' }}>{label}</button>
          ))}
        </div>

        {tab === 'market' && (
          <>
            <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Zone demand right now</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem' }}>
              {HOT_ZONES.map(z => (
                <div key={z.zone} onClick={() => setZone(z.zone.toLowerCase())} style={{ border:`1px solid ${zone===z.zone.toLowerCase()?'#fff':'rgba(255,255,255,0.12)'}`, padding:'0.9rem 1.25rem', cursor:'pointer', background:zone===z.zone.toLowerCase()?'rgba(255,255,255,0.04)':'transparent', transition:'border-color 0.2s' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontWeight:600, marginBottom:'0.15rem' }}>Zone {z.zone} — {z.label}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                        <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', padding:'1px 6px', background:'rgba(255,255,255,0.08)', color: z.demand==='Very High'?'#fff':'#9e9e9e' }}>{z.demand} Demand</span>
                        <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', color:'#555' }}>{z.available.toLocaleString()} sq available</span>
                      </div>
                    </div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.85rem', fontWeight:700, marginLeft:'1rem', flexShrink:0 }}>{z.marketRate}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Configure your campaign</p>
            <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem' }}>
              <div className="input-group" style={{flex:1, marginBottom:0}}>
                <label>Number of squares</label>
                <input type="number" min={50} step={10} value={squares} onChange={e => setSquares(+e.target.value)} />
              </div>
              <div className="input-group" style={{flex:1, marginBottom:0}}>
                <label>Duration (weeks)</label>
                <input type="number" min={1} max={52} value={weeks} onChange={e => setWeeks(+e.target.value)} />
              </div>
            </div>
            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', padding:'1rem 1.25rem', marginBottom:'1.25rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'0.4rem' }}>
                <span style={{color:'#9e9e9e'}}>{squares.toLocaleString()} sq × ${ratePerSq}/wk × {weeks} wk{weeks>1?'s':''}</span>
                <span style={{fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'1.1rem'}}>${total}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem' }}>
                <span style={{color:'#555'}}>Owners receive (80%)</span>
                <span style={{fontFamily:'Space Mono,monospace', color:'#555'}}>${(parseFloat(total)*0.80).toFixed(2)}</span>
              </div>
            </div>
            <button className="btn-primary" onClick={() => alert('Stripe rental flow coming next!')}>
              Rent {squares.toLocaleString()} Squares — ${total}
            </button>
          </>
        )}

        {tab === 'past' && (
          <>
            <p style={{ color:'#9e9e9e', fontSize:'0.85rem', marginBottom:'1.25rem' }}>Recent completed campaigns on the grid.</p>
            <div style={{ display:'flex', flexDirection:'column' }}>
              {PAST_RENTALS.map((r,i) => (
                <div key={i} style={{ padding:'0.9rem 0', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom:'0.15rem' }}>{r.renter}</div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555' }}>Zone {r.zone} · {r.squares.toLocaleString()} sq · {r.weeks} wk{r.weeks>1?'s':''}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:'Space Mono,monospace', fontWeight:700 }}>{r.total}</div>
                    <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', color:'#555' }}>ended {r.end}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:'1.25rem', padding:'1rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', marginBottom:'0.5rem', letterSpacing:'0.1em' }}>30-DAY AVERAGES</p>
              <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                {[['$415','Avg spend'],['487','Avg cluster'],['2.4 wks','Avg duration']].map(([v,l]) => (
                  <div key={l}>
                    <div style={{fontFamily:'Space Mono,monospace', fontWeight:700}}>{v}</div>
                    <div style={{fontSize:'0.7rem', color:'#555'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
