import { useState } from 'react'

const PACKAGES = [
  { id: 'single', label: '1 Square', size: '1×1', count: 1, price: 1, desc: 'Own a single square. Your profile, your link.' },
  { id: 'block', label: '10×10 Block', size: '10×10', count: 100, price: 100, desc: 'Spell words. Build logos. Earn rental income.', featured: true },
  { id: 'district', label: '100×100 District', size: '100×100', count: 10000, price: 1000, desc: 'Own a neighborhood. Maximum visibility and income.' },
]

const ZONES = [
  { id: 'a', label: 'Zone A — Center Core', price: '$25/sq', sold: '79%', desc: 'Highest demand. Most rentals. Going fast.' },
  { id: 'b', label: 'Zone B — Mid Ring', price: '$5/sq', sold: '35%', desc: 'Strong position. Great rental income.' },
  { id: 'c', label: 'Zone C — Outer Ring', price: '$1/sq', sold: '15%', desc: 'Lowest entry. Most upside as grid fills.' },
]

export default function BuyModal({ onClose }) {
  const [selected, setSelected] = useState('block')
  const [zone, setZone] = useState('c')
  const pkg = PACKAGES.find(p => p.id === selected)
  const zoneData = ZONES.find(z => z.id === zone)

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <div className="modal-title" style={{marginBottom:0}}>Buy squares.</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#555', fontSize:'1.2rem' }}>✕</button>
        </div>

        <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#f55', letterSpacing:'0.1em', marginBottom:'1.25rem' }}>
          ⚡ ZONE A IS 79% SOLD — CENTER SQUARES RUNNING OUT
        </p>

        <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Choose your package</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem' }}>
          {PACKAGES.map(pkg => (
            <div key={pkg.id} onClick={() => setSelected(pkg.id)} style={{
              border: `1px solid ${selected === pkg.id ? '#fff' : 'rgba(255,255,255,0.12)'}`,
              padding: '1rem 1.25rem', cursor: 'pointer', position: 'relative',
              background: selected === pkg.id ? 'rgba(255,255,255,0.04)' : 'transparent',
              transition: 'border-color 0.2s'
            }}>
              {pkg.featured && <div style={{ position:'absolute', top:'-1px', right:'1rem', background:'#fff', color:'#000', fontFamily:'Space Mono,monospace', fontSize:'0.55rem', fontWeight:700, padding:'2px 8px', letterSpacing:'0.1em' }}>MOST POPULAR</div>}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:700, marginBottom:'0.2rem' }}>{pkg.label}</div>
                  <div style={{ fontSize:'0.8rem', color:'#9e9e9e' }}>{pkg.desc}</div>
                </div>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:'1.2rem', fontWeight:700, marginLeft:'1rem', flexShrink:0 }}>${pkg.price}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Choose your zone</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem' }}>
          {ZONES.map(z => (
            <div key={z.id} onClick={() => setZone(z.id)} style={{
              border: `1px solid ${zone === z.id ? '#fff' : 'rgba(255,255,255,0.12)'}`,
              padding: '0.9rem 1.25rem', cursor: 'pointer',
              background: zone === z.id ? 'rgba(255,255,255,0.04)' : 'transparent',
              transition: 'border-color 0.2s'
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom:'0.15rem' }}>{z.label}</div>
                  <div style={{ fontSize:'0.78rem', color:'#9e9e9e' }}>{z.desc}</div>
                </div>
                <div style={{ textAlign:'right', marginLeft:'1rem', flexShrink:0 }}>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.8rem', fontWeight:700 }}>{z.price}</div>
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', color:'#555' }}>{z.sold} sold</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', padding:'1rem 1.25rem', marginBottom:'1.25rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'0.85rem', color:'#9e9e9e' }}>{pkg.count.toLocaleString()} squares in {zoneData.label}</div>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', marginTop:'2px' }}>Rental income starts immediately after purchase</div>
          </div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:'1.5rem', fontWeight:700 }}>${pkg.price}</div>
        </div>

        <button className="btn-primary" onClick={() => alert('Stripe integration coming — square purchase flow')}>
          Buy {pkg.count.toLocaleString()} Square{pkg.count > 1 ? 's' : ''} — ${pkg.price}
        </button>
        <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', color:'#555', textAlign:'center', marginTop:'0.75rem' }}>
          Secured by Stripe · Instant ownership · Resellable anytime
        </p>
      </div>
    </div>
  )
}
