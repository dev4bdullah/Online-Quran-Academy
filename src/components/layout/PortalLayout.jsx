import { NavLink, Link, Outlet } from 'react-router-dom'

const sections = [
  ['students', 'Students', '♧'],
  ['classes', 'Classes', '◷'],
  ['attendance', 'Attendance', '✓'],
  ['assignments', 'Assignments', '▤'],
  ['progress', 'Quran progress', '۞'],
]

export default function PortalLayout({ user, onLogout }) {
  return (
    <div className="shell">
      <header className="topbar">
        <Link className="brand" to="/students">
          <span className="brand-mark" aria-hidden="true">ق</span>
          <span className="brand-copy">
            <strong>Quran Academy</strong>
            <small>Teacher workspace</small>
          </span>
        </Link>

        <div className="account">
          <span className="user-avatar" aria-hidden="true">{user.name?.charAt(0)?.toUpperCase() || 'T'}</span>
          <span className="account-copy">
            <strong>{user.name}</strong>
            <small>Teacher</small>
          </span>
          <button className="logout-button" onClick={onLogout}>Sign out</button>
        </div>
      </header>

      <div className="site-content">
        <nav className="main-nav" aria-label="Main navigation">
          {sections.map(([id, label, icon]) => (
            <NavLink
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              to={`/${id}`}
              key={id}
            >
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <main className="main"><Outlet /></main>
        <footer className="site-footer">Online Quran Academy <span>·</span> A place to teach and grow</footer>
      </div>
    </div>
  )
}
