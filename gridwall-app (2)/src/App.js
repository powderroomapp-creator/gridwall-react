import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './index.css'
import AuthModal from './components/AuthModal'
import OnboardingFlow from './components/OnboardingFlow'
import Grid from './components/Grid'
import BuyModal from './components/BuyModal'
import SellModal from './components/SellModal'
import RentModal from './components/RentModal'
import Nav from './components/Nav'
import ActionBar from './components/ActionBar'

export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [modal, setModal] = useState(null) // 'buy' | 'sell' | 'rent'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
    setLoading(false)
    if (!data?.onboarded) setShowOnboarding(true)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    setModal(null)
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:'1rem' }}>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'1.2rem', letterSpacing:'-0.02em' }}>Grid<span style={{color:'#555'}}>Wall</span></div>
      <div style={{ fontFamily:'Space Mono,monospace', fontSize:'0.7rem', color:'#555', letterSpacing:'0.1em' }}>LOADING...</div>
    </div>
  )

  return (
    <div>
      <Nav
        session={session}
        profile={profile}
        onSignIn={() => setShowAuth(true)}
        onSignOut={handleSignOut}
      />

      <div className="page">
        <Grid session={session} onSquareClick={() => !session && setShowAuth(true)} />
      </div>

      {session && (
        <ActionBar
          onBuy={() => setModal('buy')}
          onSell={() => setModal('sell')}
          onRent={() => setModal('rent')}
        />
      )}

      {!session && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '1rem 1.5rem',
          background: 'linear-gradient(to top, rgba(0,0,0,1) 60%, transparent)',
          display: 'flex', gap: '0.75rem', justifyContent: 'center'
        }}>
          <button className="btn-primary" style={{maxWidth:'300px'}} onClick={() => setShowAuth(true)}>
            Claim Your Square
          </button>
        </div>
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}

      {showOnboarding && session && (
        <OnboardingFlow
          session={session}
          onComplete={(p) => { setProfile(p); setShowOnboarding(false) }}
        />
      )}

      {modal === 'buy' && <BuyModal session={session} profile={profile} onClose={() => setModal(null)} />}
      {modal === 'sell' && <SellModal session={session} profile={profile} onClose={() => setModal(null)} />}
      {modal === 'rent' && <RentModal session={session} profile={profile} onClose={() => setModal(null)} />}
    </div>
  )
}
