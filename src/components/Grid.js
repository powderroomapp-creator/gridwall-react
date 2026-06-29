import { useEffect, useRef, useState } from 'react'

const SAMPLE = 80
const OWNERS = [
  { name: 'GridWall', tag: 'PRIME', type: 'platform' },
  { name: 'GridWall', tag: 'PRIME', type: 'platform' },
  { name: 'alex.eth', tag: 'OWNER', type: 'user' },
  { name: 'nycbuilder', tag: 'OWNER', type: 'user' },
  { name: 'PurpleDAO', tag: 'RENTING', type: 'renter' },
  { name: 'freshdrops', tag: 'OWNER', type: 'user' },
  { name: 'moondust', tag: 'RENTING', type: 'renter' },
  { name: 'gridmaxi', tag: 'OWNER', type: 'user' },
  { name: 'theflippr', tag: 'LISTED', type: 'seller' },
]

export default function Grid({ session, onSquareClick }) {
  const canvasRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [gridData] = useState(() => {
    const d = []
    for (let r = 0; r < SAMPLE; r++) {
      d[r] = []
      for (let c = 0; c < SAMPLE; c++) {
        const dist = Math.sqrt(Math.pow(c-40,2)+Math.pow(r-40,2))
        const rand = Math.random()
        let type = 'empty', owner = null
        if (dist < 15) {
          if (rand < 0.85) { type='platform'; owner=OWNERS[0] }
          else if (rand < 0.95) { type='renter'; owner=OWNERS[Math.floor(Math.random()*OWNERS.length)] }
          else { type='sold'; owner=OWNERS[Math.floor(Math.random()*OWNERS.length)] }
        } else if (dist < 32) {
          if (rand < 0.5) { type='sold'; owner=OWNERS[Math.floor(Math.random()*OWNERS.length)] }
          else if (rand < 0.6) { type='renter'; owner=OWNERS[Math.floor(Math.random()*OWNERS.length)] }
        } else {
          if (rand < 0.2) { type='sold'; owner=OWNERS[Math.floor(Math.random()*OWNERS.length)] }
        }
        d[r][c] = { type, owner, flicker: Math.random() }
      }
    }
    return d
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const SQ = canvas.width / SAMPLE
    let tick = 0, rafId

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let r = 0; r < SAMPLE; r++) {
        for (let c = 0; c < SAMPLE; c++) {
          const cell = gridData[r][c]
          const flicker = Math.sin(tick * 0.03 + cell.flicker * 10) * 0.5 + 0.5
          const x = c * SQ, y = r * SQ
          if (cell.type === 'platform') ctx.fillStyle = `rgba(255,255,255,${0.7+flicker*0.3})`
          else if (cell.type === 'renter') ctx.fillStyle = `rgba(255,255,255,${0.35+flicker*0.15})`
          else if (cell.type === 'sold') ctx.fillStyle = `rgba(255,255,255,${0.12+flicker*0.08})`
          else ctx.fillStyle = 'rgba(255,255,255,0.03)'
          ctx.fillRect(x+0.5, y+0.5, SQ-1, SQ-1)
        }
      }
      tick++
      rafId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafId)
  }, [gridData])

  function handleMouseMove(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const SQ = canvas.width / SAMPLE
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const c = Math.floor((e.clientX - rect.left) * scaleX / SQ)
    const r = Math.floor((e.clientY - rect.top) * scaleY / SQ)
    if (c >= 0 && c < SAMPLE && r >= 0 && r < SAMPLE) {
      const cell = gridData[r][c]
      if (cell.owner) setTooltip({ x: e.clientX, y: e.clientY, owner: cell.owner })
      else setTooltip(null)
    }
  }

  return (
    <div style={{ padding:'1rem', textAlign:'center' }}>
      <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'0.5rem' }}>
        Live grid preview — 80×80 sample of 1,000,000
      </p>
      <h2 style={{ fontSize:'clamp(1.2rem,3vw,1.8rem)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:'0.35rem' }}>
        Every square has an owner.
      </h2>
      <p style={{ color:'#9e9e9e', fontSize:'0.85rem', marginBottom:'1rem' }}>
        {session ? 'Hover squares to see owners. Use the buttons below to buy, sell, or rent.' : 'Sign in to claim your square.'}
      </p>
      <div style={{ position:'relative', display:'inline-block' }}>
        <canvas ref={canvasRef} width={560} height={560}
          style={{ display:'block', border:'1px solid rgba(255,255,255,0.1)', cursor:'crosshair', maxWidth:'100%' }}
          onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)} onClick={onSquareClick} />
        {tooltip && (
          <div style={{ position:'fixed', left:tooltip.x+12, top:tooltip.y-30, background:'#fff', color:'#000',
            fontFamily:'Space Mono,monospace', fontSize:'0.65rem', padding:'3px 8px', fontWeight:700,
            pointerEvents:'none', zIndex:200, whiteSpace:'nowrap' }}>
            {tooltip.owner.name} — {tooltip.owner.tag}
          </div>
        )}
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:'2.5rem', marginTop:'1.5rem', flexWrap:'wrap' }}>
        {[['247,483','Squares claimed'],['18,294','Currently rented'],['$4.20','Avg resale value']].map(([val,label]) => (
          <div key={label} style={{ textAlign:'center' }}>
            <div style={{ fontFamily:'Space Mono,monospace', fontSize:'1.3rem', fontWeight:700 }}>{val}</div>
            <div style={{ fontSize:'0.7rem', color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:2 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
