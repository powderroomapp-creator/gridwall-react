import { useState } from 'react'

const MOCK_OWNED = [
  { id: 1, zone: 'C', coords: '(847, 312)', count: 1, purchasePrice: 1, currentValue: 2.40 },
  { id: 2, zone: 'B', coords: '(412, 501)', count: 100, purchasePrice: 100, currentValue: 340 },
]

export default function SellModal({ profile, onClose }) {
  const [selected, setSelected] = useState(null)
  const [askPrice, setAskPrice] = useState('')
  const [qty, setQty] = useState(1)
  const hasSquares = MOCK_OWNED.length > 0

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 520 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <div className="modal-title" style={{marginBottom:0}}>Sell squares.</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#555', fontSize:'1.2rem' }}>✕</button>
        </div>

        {!hasSquares ? (
          <div style={{ textAlign:'center', padding:'2rem 0' }}>
            <p style={{ color:'#9e9e9e', marginBottom:'1rem' }}>You don't own any squares yet.</p>
            <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.75rem', color:'#555' }}>Buy squares first, then list them here when you're ready to sell.</p>
          </div>
        ) : (
          <>
            <p style={{ color:'#9e9e9e', fontSize:'0.85rem', marginBottom:'1.25rem' }}>Select squares to list on the marketplace.</p>

            <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Your squares</p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem' }}>
              {MOCK_OWNED.map(sq => (
                <div key={sq.id} onClick={() => { setSelected(sq.id); setAskPrice(''); setQty(Math.min(sq.count, 1)) }} style={{
                  border: `1px solid ${selected === sq.id ? '#fff' : 'rgba(255,255,255,0.12)'}`,
                  padding:'1rem 1.25rem', cursor:'pointer',
                  background: selected === sq.id ? 'rgba(255,255,255,0.04)' : 'transparent',
                  transition:'border-color 0.2s'
                }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontWeight:600, marginBottom:'0.2rem' }}>Zone {sq.zone} — {sq.coords}</div>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555' }}>{sq.count} square{sq.count>1?'s':''} · Bought at ${sq.purchasePrice}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.9rem', fontWeight:700, color:'#fff' }}>${sq.currentValue}</div>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', color: sq.currentValue > sq.purchasePrice ? '#4caf50' : '#f44336' }}>
                        {sq.currentValue > sq.purchasePrice ? '+' : ''}{(((sq.currentValue - sq.purchasePrice) / sq.purchasePrice) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selected && (
              <>
                <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1rem' }}>
                  <div className="input-group" style={{flex:1, marginBottom:0}}>
                    <label>Quantity to sell</label>
                    <input type="number" min={1} max={MOCK_OWNED.find(s=>s.id===selected)?.count || 1}
                      value={qty} onChange={e => setQty(+e.target.value)} />
                  </div>
                  <div className="input-group" style={{flex:1, marginBottom:0}}>
                    <label>Your ask price ($)</label>
                    <input type="number" min={0.01} step={0.01} placeholder="e.g. 5.00"
                      value={askPrice} onChange={e => setAskPrice(e.target.value)} />
                  </div>
                </div>

                {askPrice && (
                  <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', padding:'1rem', marginBottom:'1.25rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'0.4rem' }}>
                      <span style={{color:'#9e9e9e'}}>You receive (after 8% fee)</span>
                      <span style={{fontFamily:'Space Mono,monospace', fontWeight:700}}>${(parseFloat(askPrice||0) * qty * 0.92).toFixed(2)}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem' }}>
                      <span style={{color:'#555'}}>Platform fee (8%)</span>
                      <span style={{fontFamily:'Space Mono,monospace', color:'#555'}}>${(parseFloat(askPrice||0) * qty * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button className="btn-primary" onClick={() => alert('Listing would go live on the marketplace')}>
                  List {qty} Square{qty>1?'s':''} at ${askPrice || '—'} each
                </button>
              </>
            )}
          </>
        )}

        <div style={{ marginTop:'1.5rem', padding:'1rem', border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)' }}>
          <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', color:'#555', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Market snapshot</p>
          <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
            {[['$2.40','Avg Zone C price'],['$8.50','Avg Zone B price'],['$38','Avg Zone A price']].map(([v,l]) => (
              <div key={l}>
                <div style={{fontFamily:'Space Mono,monospace', fontWeight:700}}>{v}</div>
                <div style={{fontSize:'0.7rem', color:'#555'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
