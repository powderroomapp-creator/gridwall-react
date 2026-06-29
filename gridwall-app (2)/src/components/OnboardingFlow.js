import { useState } from 'react'
import { supabase } from '../supabase'

const PACKAGES = [
  { id: 'single', label: '1 Square', size: '1×1', count: 1, price: 1, desc: 'Dip your toe in. Own a piece of the grid.' },
  { id: 'block', label: '10×10 Block', size: '10×10', count: 100, price: 100, desc: 'Enough to spell a word. Real rental income.', featured: true },
  { id: 'district', label: '100×100 District', size: '100×100', count: 10000, price: 1000, desc: 'Own a neighborhood. Maximum rental demand.' },
]

export default function OnboardingFlow({ session, onComplete }) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState({ username: '', bio: '', instagram: '', tiktok: '', facebook: '' })
  const [selectedPkg, setSelectedPkg] = useState('block')
  const [saving, setSaving] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(session.user.user_metadata?.avatar_url || '')

  async function saveProfile() {
    setSaving(true)
    const { data, error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      email: session.user.email,
      username: profile.username || session.user.email.split('@')[0],
      bio: profile.bio,
      instagram: profile.instagram,
      tiktok: profile.tiktok,
      facebook: profile.facebook,
      avatar_url: avatarUrl,
      onboarded: true,
      created_at: new Date().toISOString()
    }).select().single()
    setSaving(false)
    if (!error) onComplete(data)
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: step === 2 ? '600px' : '480px' }}>

        {/* Step indicator */}
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              flex:1, height:'2px',
              background: s <= step ? '#fff' : 'rgba(255,255,255,0.15)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="modal-title">Build your profile.</div>
            <p style={{ color:'#9e9e9e', fontSize:'0.85rem', marginBottom:'1.5rem' }}>This is what people see when they tap your square.</p>

            {avatarUrl && (
              <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
                <img src={avatarUrl} alt="avatar" style={{ width:72, height:72, borderRadius:'50%', objectFit:'cover', border:'2px solid rgba(255,255,255,0.2)' }} />
              </div>
            )}

            <div className="input-group">
              <label>Username</label>
              <input placeholder="yourhandle" value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Bio</label>
              <textarea placeholder="What are you about?" rows={3} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})}
                style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', padding:'0.75rem 1rem', color:'#fff', resize:'none', outline:'none' }} />
            </div>

            <div style={{ marginBottom:'1rem' }}>
              <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Link your socials</p>
              <div className="input-group" style={{marginBottom:'0.5rem'}}>
                <label>Instagram</label>
                <input placeholder="@yourhandle" value={profile.instagram} onChange={e => setProfile({...profile, instagram: e.target.value})} />
              </div>
              <div className="input-group" style={{marginBottom:'0.5rem'}}>
                <label>TikTok</label>
                <input placeholder="@yourhandle" value={profile.tiktok} onChange={e => setProfile({...profile, tiktok: e.target.value})} />
              </div>
              <div className="input-group" style={{marginBottom:'0'}}>
                <label>Facebook</label>
                <input placeholder="facebook.com/yourname" value={profile.facebook} onChange={e => setProfile({...profile, facebook: e.target.value})} />
              </div>
            </div>

            <button className="btn-primary" onClick={() => setStep(2)}>Next — Pick Your Squares</button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="modal-title">Claim your territory.</div>
            <p style={{ color:'#9e9e9e', fontSize:'0.85rem', marginBottom:'0.5rem' }}>
              Zone A is <span style={{color:'#fff', fontWeight:600}}>79% sold.</span> Center squares won't last.
            </p>
            <p style={{ fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#555', marginBottom:'1.5rem', letterSpacing:'0.08em' }}>
              247,483 SQUARES CLAIMED — 752,517 REMAINING
            </p>

            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.5rem' }}>
              {PACKAGES.map(pkg => (
                <div key={pkg.id}
                  onClick={() => setSelectedPkg(pkg.id)}
                  style={{
                    border: `1px solid ${selectedPkg === pkg.id ? '#fff' : 'rgba(255,255,255,0.12)'}`,
                    padding: '1.25rem',
                    cursor: 'pointer',
                    background: pkg.featured && selectedPkg === pkg.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                    position: 'relative',
                    transition: 'border-color 0.2s',
                  }}>
                  {pkg.featured && (
                    <div style={{
                      position:'absolute', top:'-1px', right:'1rem',
                      background:'#fff', color:'#000',
                      fontFamily:'Space Mono,monospace', fontSize:'0.55rem',
                      fontWeight:700, padding:'2px 8px', letterSpacing:'0.1em'
                    }}>MOST POPULAR</div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'0.2rem' }}>{pkg.label}</div>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.7rem', color:'#555', marginBottom:'0.5rem' }}>{pkg.count.toLocaleString()} SQUARES</div>
                      <div style={{ fontSize:'0.82rem', color:'#9e9e9e' }}>{pkg.desc}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0, marginLeft:'1rem' }}>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'1.3rem', fontWeight:700 }}>${pkg.price}</div>
                      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.6rem', color:'#555' }}>${(pkg.price/pkg.count).toFixed(2)}/sq</div>
                    </div>
                  </div>
                  {selectedPkg === pkg.id && (
                    <div style={{ position:'absolute', top:'50%', left:'-8px', transform:'translateY(-50%)', width:'4px', height:'24px', background:'#fff' }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button className="btn-secondary" style={{flex:'0 0 auto', width:'auto', padding:'0.85rem 1.25rem'}} onClick={() => setStep(1)}>←</button>
              <button className="btn-primary" onClick={() => setStep(3)}>
                Continue — ${PACKAGES.find(p => p.id === selectedPkg)?.price}
              </button>
            </div>
            <button onClick={() => setStep(3)} style={{ background:'none', border:'none', color:'#555', fontSize:'0.75rem', width:'100%', marginTop:'0.75rem', textDecoration:'underline' }}>
              Skip for now
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="modal-title">You're almost in.</div>
            <p style={{ color:'#9e9e9e', fontSize:'0.85rem', marginBottom:'1.5rem' }}>
              Review your setup before we drop you on the grid.
            </p>

            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', padding:'1.25rem', marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', gap:'1rem', alignItems:'center', marginBottom:'1rem' }}>
                {avatarUrl && <img src={avatarUrl} alt="" style={{width:44, height:44, borderRadius:'50%', objectFit:'cover'}} />}
                <div>
                  <div style={{ fontWeight:600 }}>{profile.username || session.user.email.split('@')[0]}</div>
                  <div style={{ fontSize:'0.8rem', color:'#9e9e9e' }}>{profile.bio || 'No bio yet'}</div>
                </div>
              </div>
              {(profile.instagram || profile.tiktok || profile.facebook) && (
                <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                  {profile.instagram && <span style={{fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#9e9e9e', background:'rgba(255,255,255,0.06)', padding:'2px 8px'}}>IG: {profile.instagram}</span>}
                  {profile.tiktok && <span style={{fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#9e9e9e', background:'rgba(255,255,255,0.06)', padding:'2px 8px'}}>TT: {profile.tiktok}</span>}
                  {profile.facebook && <span style={{fontFamily:'Space Mono,monospace', fontSize:'0.65rem', color:'#9e9e9e', background:'rgba(255,255,255,0.06)', padding:'2px 8px'}}>FB</span>}
                </div>
              )}
            </div>

            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button className="btn-secondary" style={{flex:'0 0 auto', width:'auto', padding:'0.85rem 1.25rem'}} onClick={() => setStep(2)}>←</button>
              <button className="btn-primary" onClick={saveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Enter GridWall →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
