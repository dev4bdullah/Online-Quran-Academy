const sections = [
  ['overview', 'Overview', '◈'],
  ['students', 'My students', '♧'],
  ['classes', 'Class schedule', '◷'],
  ['attendance', 'Attendance', '✓'],
  ['assignments', 'Assignments', '▤'],
  ['progress', 'Quran progress', '۞'],
]

export default function PortalLayout({ user, onLogout, children }) {
  return (
    <div className="shell">
      <aside className="side">
        <a className="brand" href="#overview">
          <span className="brand-mark" aria-hidden="true">ق</span>
          <span><strong>Quran</strong><small> Tutor workspace</small></span>
        </a>

        <div className="nav-caption">YOUR TEACHING</div>
        <nav aria-label="Dashboard sections">
          {sections.map(([id, label, icon], index) => (
            <a className={index === 0 ? 'nav-item nav-overview' : 'nav-item'} href={`#${id}`} key={id}>
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              {label}
            </a>
          ))}
        </nav>

        <div className="side-foot">
          <div className="user-avatar" aria-hidden="true">{user.name?.charAt(0)?.toUpperCase() || 'T'}</div>
          <div className="user-details">
            <strong>{user.name}</strong>
            <small>Tutor account</small>
          </div>
          <button className="logout-button" onClick={onLogout} aria-label="Sign out" title="Sign out">↗</button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  )
}
