import { useEffect, useRef, useState } from 'react'

const TAGLINES = [
  "Rent it out.",
  "Flip it for profit.",
  "Build your brand.",
  "Earn while you sleep.",
  "Digital real estate.",
  "Your pixel. Your rules.",
  "The grid is filling up.",
  "Own a piece of the internet.",
  "Buy low. Sell high.",
  "Passive income at $1.",
]

const SAMPLE = 100
const CENTER = SAMPLE / 2
const ZONE_A_RADIUS = 18.2
const ZONE_AB_RADIUS = 41.6

function getZone(c, r) {
  const dist = Math.sqrt(Math.pow(c - CENTER, 2) + Math.pow(r - CENTER, 2))
  if (dist <= ZONE_A_RADIUS) return 'A'
  if (dist <= ZONE_AB_RADIUS) return 'B'
  return 'C'
}

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

const ACTIVITY = [
  { text: '<strong>GridWall</strong> locked 200 center squares', time: 'just now', platform: true },
  { text: '<strong>alex.eth</strong> bought 4 squares in Zone A', time: '12s ago' },
  { text: '<strong>PurpleDAO</strong> rented 340 squares for 4 weeks', time: '38s ago' },
  { text: '<strong>theflippr</strong> listed a Zone A square for $47', time: '1m ago' },
  { text: '<strong>nycbuilder</strong> bought 12 squares in Zone B', time: '2m ago' },
  { text: '<strong>moondust</strong> rented 180 squares for 1 week', time: '3m ago' },
  { text: '<strong>gridmaxi</strong> sold a Zone A square for $38', time: '4m ago' },
  { text: '<strong>GridWall</strong> locked 50 mid-ring squares', time: '5m ago', platform: true },
]

export default function HomePage({ onSignIn }) {
  const canvasRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [tagline, setTagline] = useState('')
  const [activityItems, setActivityItems] = useState(ACTIVITY.slice(0, 5))
  const [activityIdx, setActivityIdx] = useState(5)
  const [wlCount, setWlCount] = useState(2847)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const [gridData] = useState(() => {
    const d = []
    for (let r = 0; r < SAMPLE; r++) {
      d[r] = []
      for (let c = 0; c < SAMPLE; c++) {
        const zone = getZone(c, r)
        const rand = Math.random()
        let owner = null
        let type = 'empty'
        if (rand < 0.15) {
          owner = OWNERS[Math.floor(Math.random() * OWNERS.length)]
          type = owner.type === 'platform' ? 'platform' : owner.type === 'renter' ? 'renter' : 'sold'
        }
        d[r][c] = { zone, type, owner, shade: Math.random() }
      }
    }
    return d
  })

  // Typewriter
  useEffect(() => {
    let idx = Math.floor(Math.random() * TAGLINES.length)
    let charIdx = 0
    let deleting = false
    let timeout

    function type() {
      const current = TAGLINES[idx]
      if (!deleting) {
        setTagline(current.substring(0, charIdx + 1))
        charIdx++
        if (charIdx === current.length) { deleting = true; timeout = setTimeout(type, 2200); return }
        timeout = setTimeout(type, 55)
      } else {
        setTagline(current.substring(0, charIdx - 1))
        charIdx--
        if (charIdx === 0) { deleting = false; idx = (idx + 1) % TAGLINES.length; timeout = setTimeout(type, 300); return }
        timeout = setTimeout(type, 30)
      }
    }
    type()
    return () => clearTimeout(timeout)
  }, [])

  // Grid animation
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
          const x = c * SQ, y = r * SQ

          let base
          if (cell.zone === 'A') base = 245
          else if (cell.zone === 'B') base = 140
          else base = 55

          const variance = (cell.shade - 0.5) * 18
          const pulse = cell.type !== 'empty' ? Math.sin(tick * 0.03 + cell.shade * 10) * 8 : 0
          const value = Math.max(20, Math.min(255, base + variance + pulse))

          ctx.fillStyle = `rgb(${value},${value},${value})`
          ctx.fillRect(x+0.5, y+0.5, SQ-1, SQ-1)
        }
      }
      tick++
      rafId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafId)
  }, [gridData])

  // Activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityItems(prev => {
        const next = [ACTIVITY[activityIdx % ACTIVITY.length], ...prev.slice(0, 4)]
        return next
      })
      setActivityIdx(i => i + 1)
    }, 3200)
    return () => clearInterval(interval)
  }, [activityIdx])

  // Waitlist count tick
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) setWlCount(n => n + 1)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

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
      if (cell.owner) setTooltip({ x: e.clientX, y: e.clientY, owner: cell.owner, zone: cell.zone })
      else setTooltip({ x: e.clientX, y: e.clientY, owner: null, zone: cell.zone })
    }
  }

  async function submitWaitlist() {
    if (!email.includes('@')) return
    try {
      await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': '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' },
        body: JSON.stringify({ email, listIds: [3], updateEnabled: true })
      })
    } catch(e) {}
    setSubmitted(true)
    setWlCount(n => n + 1)
  }

  return (
    <div style={{ background: '#000', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>

      {/* HERO + GRID + LIVE SIDEBAR */}
      <section style={{ paddingTop: '80px', minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Live activity sidebar - absolutely positioned in the empty left margin, doesn't affect centering */}
        <div className="gw-activity-sidebar">
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'1rem' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#fff', animation:'pulse 2s infinite' }} />
            <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.15em', textTransform:'uppercase' }}>Live activity</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:0, maxHeight:'500px', overflow:'hidden' }}>
            {activityItems.map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'0.5rem', padding:'0.7rem 0', borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:'0.75rem', textAlign:'left', opacity: 1 - (i * 0.15) }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'#fff', flexShrink:0, marginTop:'5px', boxShadow: item.platform ? '0 0 6px rgba(255,255,255,0.6)' : 'none' }} />
                <div style={{ flex:1 }}>
                  <div style={{ color:'#9e9e9e', lineHeight:1.4 }} dangerouslySetInnerHTML={{__html: item.text}} />
                  <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', color:'#444', marginTop:'2px' }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Headline + typewriter - bigger again, eyebrow removed */}
        <h1 style={{ fontSize:'clamp(2.2rem,5.5vw,4.5rem)', fontWeight:700, lineHeight:1.0, letterSpacing:'-0.03em', marginBottom:'0.2rem', marginTop:'1.5rem' }}>
          Own your spot.
        </h1>
        <div style={{ fontSize:'clamp(2.2rem,5.5vw,4.5rem)', fontWeight:700, lineHeight:1.0, letterSpacing:'-0.03em', marginBottom:'1.5rem', minHeight:'1.1em', color:'#555' }}>
          {tagline}<span style={{ display:'inline-block', width:3, height:'0.85em', background:'#fff', marginLeft:4, verticalAlign:'middle', animation:'blink 1s infinite' }} />
        </div>

        {/* Grid - bigger now, with zoom */}
        <div style={{ position:'relative', display:'inline-block', marginBottom:'0.75rem', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)', width:'min(720px, calc(100vw - 1.5rem))', height:'min(720px, calc(100vw - 1.5rem))' }}>
          <canvas ref={canvasRef} width={720} height={720}
            style={{ display:'block', cursor:'crosshair', width:'100%', height:'100%', transform:`scale(${zoom})`, transformOrigin:'center center', transition:'transform 0.15s ease-out' }}
            onMouseMove={handleMouseMove} onMouseLeave={() => setTooltip(null)} />
          {tooltip && (
            <div style={{ position:'fixed', left:tooltip.x+12, top:tooltip.y-30, background:'#fff', color:'#000', fontFamily:'Space Mono,monospace', fontSize:'0.65rem', padding:'3px 8px', fontWeight:700, pointerEvents:'none', zIndex:200, whiteSpace:'nowrap' }}>
              {tooltip.owner ? `${tooltip.owner.name} — ${tooltip.owner.tag}` : `Zone ${tooltip.zone} — available`}
            </div>
          )}
        </div>

        {/* Zoom slider */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem', width:'min(720px, calc(100vw - 1.5rem))' }}>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.7rem', color:'#555' }}>−</span>
          <input
            type="range" min="1" max="8" step="0.1" value={zoom}
            onChange={e => setZoom(parseFloat(e.target.value))}
            style={{ flex:1, accentColor:'#fff', cursor:'pointer' }}
          />
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.7rem', color:'#555' }}>+</span>
          <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#9e9e9e', minWidth:'34px', textAlign:'right' }}>{zoom.toFixed(1)}x</span>
        </div>

        {/* Description moved below grid */}
        <p style={{ color:'#9e9e9e', fontSize:'clamp(0.8rem,1.6vw,0.95rem)', maxWidth:480, marginBottom:'1.5rem', lineHeight:1.6 }}>
          Buy a square. Customize your profile. Rent it out for passive income. Sell it for profit. The grid is filling up.
        </p>

        {/* Zone legend */}
        <div style={{ display:'flex', justifyContent:'center', gap:'1.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
          {[['#f5f5f5', 'Zone A — center'], ['#8c8c8c', 'Zone B — mid'], ['#373737', 'Zone C — outer']].map(([color, label]) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <div style={{ width:10, height:10, background:color, border:'1px solid rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize:'0.7rem', color:'#9e9e9e' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Grid stats */}
        <div style={{ display:'flex', justifyContent:'center', gap:'2.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
          {[['247,483','Squares claimed'],['18,294','Currently rented'],['$4.20','Avg resale value']].map(([val,label]) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'1.2rem', fontWeight:700 }}>{val}</div>
              <div style={{ fontSize:'0.7rem', color:'#555', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>


      {/* HOW IT WORKS */}
      <section style={{ padding:'5rem 2rem', maxWidth:1000, margin:'0 auto', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'1rem' }}>How it works</p>
        <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:'2.5rem' }}>Three ways to play.</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1.5rem' }}>
          {[
            ['01 — OWN', 'Buy your square', 'Pick your spot on the 1000×1000 grid. Add your photo, link, and color. Yours forever — or until you sell it.'],
            ['02 — EARN', 'Rent it out', 'Advertisers rent clusters of squares to spell words, build logos, run campaigns. Your square earns while you sleep.'],
            ['03 — FLIP', 'Sell for profit', 'Center squares are trading at 10x already. List yours on the marketplace. Buy low, sell high — just like real estate.'],
            ['04 — ADVERTISE', 'Run a campaign', 'Rent a cluster of squares to build your brand on the grid. Seen by everyone. Cheaper than any ad platform alive.'],
          ].map(([num, title, body]) => (
            <div key={num} style={{ border:'1px solid rgba(255,255,255,0.1)', padding:'1.75rem', transition:'border-color 0.2s' }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.15em', marginBottom:'1rem' }}>{num}</div>
              <div style={{ fontWeight:600, fontSize:'1.05rem', marginBottom:'0.5rem' }}>{title}</div>
              <div style={{ fontSize:'0.875rem', color:'#9e9e9e', lineHeight:1.6 }}>{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ZONE PRICING */}
      <section style={{ padding:'5rem 2rem', borderTop:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
        <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.2em', textTransform:'uppercase', marginBottom:'1rem' }}>Zone pricing</p>
        <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:700, letterSpacing:'-0.02em', marginBottom:'0.5rem' }}>Location is everything.</h2>
        <p style={{ color:'#9e9e9e', fontSize:'0.9rem', maxWidth:460, margin:'0 auto 2.5rem' }}>Just like real estate. Center squares get the most eyes, the most rental demand, and the highest resale value.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:1, maxWidth:800, margin:'0 auto', background:'rgba(255,255,255,0.08)' }}>
          {[
            ['Zone A — Center Core', '$25', 'Prime real estate', 'Most visible. Highest rental demand. Already reselling at 3-5×.', '79%', 40000],
            ['Zone B — Mid Ring', '$5', 'Strong position', 'High traffic, solid rental income. Sweet spot for investors.', '35%', 360000],
            ['Zone C — Outer Ring', '$1', 'Early entry', 'Cheapest way in. As the grid fills, outer squares appreciate.', '15%', 600000],
          ].map(([zone, price, name, desc, sold, total]) => (
            <div key={zone} style={{ background:'#000', padding:'2rem 1.5rem', textAlign:'left' }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', color:'#555', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'1rem' }}>{zone}</div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'2rem', fontWeight:700, marginBottom:'0.25rem' }}>{price}</div>
              <div style={{ fontWeight:600, fontSize:'0.9rem', marginBottom:'0.5rem' }}>{name}</div>
              <div style={{ fontSize:'0.8rem', color:'#9e9e9e', lineHeight:1.5, marginBottom:'1rem' }}>{desc}</div>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555' }}>SOLD: {Math.round(total * parseFloat(sold)/100).toLocaleString()} / {total.toLocaleString()}</div>
              <div style={{ height:2, background:'rgba(255,255,255,0.1)', marginTop:'0.5rem' }}>
                <div style={{ height:'100%', background:'#fff', width:sold, transition:'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding:'8rem 2rem', textAlign:'center', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
        <h2 style={{ fontSize:'clamp(2rem,5vw,4rem)', fontWeight:700, letterSpacing:'-0.03em', marginBottom:'1rem', lineHeight:1.1 }}>The grid fills up.<br/>Don't miss your spot.</h2>
        <p style={{ color:'#9e9e9e', marginBottom:'2.5rem' }}>1,000,000 squares. Once they're gone, they're gone.</p>
        {!submitted ? (
          <div style={{ display:'flex', maxWidth:420, margin:'0 auto 1rem', border:'1px solid rgba(255,255,255,0.2)' }}>
            <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
              style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'none', padding:'0.9rem 1.25rem', color:'#fff', fontFamily:'Space Grotesk,sans-serif', fontSize:'0.95rem', outline:'none' }} />
            <button onClick={submitWaitlist} style={{ background:'#fff', color:'#000', border:'none', padding:'0.9rem 1.5rem', fontFamily:'Space Grotesk,sans-serif', fontSize:'0.85rem', fontWeight:700, cursor:'pointer', letterSpacing:'0.04em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
              Claim Spot
            </button>
          </div>
        ) : (
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.85rem', color:'#fff', border:'1px solid rgba(255,255,255,0.2)', padding:'0.9rem 1.5rem', maxWidth:420, margin:'0 auto 1rem', textAlign:'left' }}>
            ✓ You're on the list.
          </div>
        )}
        <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.7rem', color:'#555' }}>— {wlCount.toLocaleString()} people already waiting —</p>
        <button onClick={onSignIn} style={{ marginTop:'1.5rem', background:'transparent', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', padding:'0.85rem 2rem', fontFamily:'Space Grotesk,sans-serif', fontSize:'0.9rem', fontWeight:600, cursor:'pointer', letterSpacing:'0.04em' }}>
          Sign In → Enter Grid
        </button>
      </section>

      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.08)', padding:'2rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
        <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.9rem', fontWeight:700 }}>Grid<span style={{color:'#555'}}>Wall</span></div>
        <span style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.08em' }}>gridwall.app — © 2025</span>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        @keyframes blink { 0%,50%{opacity:1} 51%,100%{opacity:0} }
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        .gw-activity-sidebar { display: block; position: absolute; left: 2rem; top: 110px; width: 240px; }
        @media (max-width: 1300px) {
          .gw-activity-sidebar { left: 0.75rem; width: 160px; top: 100px; }
        }
        @media (max-width: 900px) {
          .gw-activity-sidebar { display: none; }
        }
      `}</style>
    </div>
  )
}
