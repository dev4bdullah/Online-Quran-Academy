import { NavLink, Link, Outlet } from 'react-router-dom'

const sections = [
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
        <Link className="brand" to="/students">
          <span className="brand-mark" aria-hidden="true">ق</span>
          <span><strong>Quran</strong><small> Tutor workspace</small></span>
        </Link>

        <div className="nav-caption">YOUR TEACHING</div>
        <nav aria-label="Dashboard sections">
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

        <div className="side-foot">
          <div className="user-avatar" aria-hidden="true">{user.name?.charAt(0)?.toUpperCase() || 'T'}</div>
          <div className="user-details">
            <strong>{user.name}</strong>
            <small>Tutor account</small>
          </div>
          <button className="logout-button" onClick={onLogout} aria-label="Sign out" title="Sign out">↗</button>
        </div>
      </aside>

      <main className="main"><Outlet /></main>
    </div>
  )
}
