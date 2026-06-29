export default function Nav({ session, profile, onSignIn, onSignOut }) {
  return (
    <nav className="nav">
      <div className="nav-logo">Grid<span>Wall</span></div>
      <div className="nav-actions">
        {session ? (
          <>
            <span style={{ fontSize: '0.8rem', color: '#9e9e9e', fontFamily: 'Space Mono,monospace' }}>
              {profile?.username || session.user.email?.split('@')[0]}
            </span>
            <button className="nav-btn-ghost" onClick={onSignOut}>Sign Out</button>
          </>
        ) : (
          <button className="nav-btn" onClick={onSignIn}>Sign In</button>
        )}
      </div>
    </nav>
  )
}
