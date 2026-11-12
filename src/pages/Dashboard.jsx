import { Link } from 'react-router-dom'
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useApi } from '../api.js'
import { getPageState } from '../components/ui/LoadingState.jsx'

function Overview() {
  const stats = useApi('/stats')
  const classes = useApi('/classes')
  const assignments = useApi('/assignments')
  const wait = getPageState(stats, classes, assignments)
  if (wait) return wait

  const { totals, attention, trend } = stats.data
  const cards = [
    ['Students', totals.students, 'Enrolled in your academy', '♧'],
    ['Classes', totals.classes, 'Lessons on your schedule', '◷'],
    ['Attendance', `${totals.attendance}%`, 'Average attendance', '✓'],
    ['Assignments', totals.assignments, 'Lessons to practise', '▤'],
  ]

  return (
    <>
      <section className="stats" aria-label="Academy overview">
        {cards.map(([label, value, note, icon]) => (
          <article className="card stat-card" key={label}>
            <div className="stat-top"><span>{label}</span><span className="stat-icon" aria-hidden="true">{icon}</span></div>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <section className="grid2 overview-grid">
        <article className="card overview-card">
          <div className="card-heading">
            <div><span className="eyebrow">KEEP GROWING</span><h2>Student enrollment</h2></div>
            <span className="tag ok">This year</span>
          </div>
          {trend.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trend} margin={{ top: 10, right: 4, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="#E8E6DD" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="enrolled" name="Students enrolled" fill="#176B55" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="empty">Enrollment history will appear here as your academy grows.</p>}
        </article>

        <article className="card overview-card">
          <div className="card-heading">
            <div><span className="eyebrow">ON YOUR SCHEDULE</span><h2>Upcoming classes</h2></div>
            <Link className="text-link" to="/classes">See all</Link>
          </div>
          {classes.data.slice(0, 3).map((item) => (
            <div className="row class-row" key={item._id}>
              <span className="class-mark" aria-hidden="true">◷</span>
              <div className="row-copy">
                <strong>{item.name}</strong>
                <small>{item.time} · {item.teacher}</small>
              </div>
              <a className="btn join-button" href={item.link} target="_blank" rel="noreferrer">Join</a>
            </div>
          ))}
          {!classes.data.length && <p className="empty">No classes scheduled. Add a class to get started.</p>}
        </article>
      </section>

      <section className="grid2 overview-grid">
        <article className="card overview-card">
          <div className="card-heading">
            <div><span className="eyebrow">A GENTLE REMINDER</span><h2>Students to check in on</h2></div>
          </div>
          {attention.slice(0, 4).map((student) => (
            <div className="row" key={student._id}>
              <div className="row-copy"><strong>{student.name}</strong><small>{student.course}</small></div>
              <span className="tags">
                {student.attendance < 90 && <i className="tag warn">{student.attendance}% attendance</i>}
                {student.fee === 'Pending' && <i className="tag gold">Fee pending</i>}
              </span>
            </div>
          ))}
          {!attention.length && <p className="empty">Everyone is on track. Alhamdulillah.</p>}
        </article>

        <article className="card overview-card">
          <div className="card-heading">
            <div><span className="eyebrow">COMING UP</span><h2>Assignments</h2></div>
            <Link className="text-link" to="/assignments">See all</Link>
          </div>
          {assignments.data.slice(0, 3).map((item) => (
            <div className="row" key={item._id}>
              <div className="row-copy"><strong>{item.title}</strong><small>{item.classroom} · Due {item.due}</small></div>
              <i className="tag gold">{item.submitted}/{item.total}</i>
            </div>
          ))}
          {!assignments.data.length && <p className="empty">No assignments yet. Set a small goal for the next lesson.</p>}
        </article>
      </section>
    </>
  )
}

export default function Dashboard({ user }) {
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  }).format(new Date())

  return (
    <div className="dashboard-page">
      <header className="welcome-head">
        <div>
          <span className="eyebrow">{today}</span>
          <h1>Assalamu alaikum, {user.name?.split(' ')[0]}</h1>
          <p>May your teaching bring barakah. Here’s your academy at a glance.</p>
        </div>
        <Link className="btn solid quick-action" to="/attendance"><span aria-hidden="true">✓</span> Take attendance</Link>
      </header>

      <Overview />
      <footer className="dashboard-footer">May Allah bless your efforts in teaching the Quran.</footer>
    </div>
  )
}
