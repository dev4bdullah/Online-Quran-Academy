import { useState } from 'react'
import { api, useApi } from '../api.js'
import { getPageState } from '../components/ui/LoadingState.jsx'

export function ProgressPage({ role }) {
  const progress = useApi('/progress')
  const [sel, setSel] = useState('')
  const [edit, setEdit] = useState(null)
  const [msg, setMsg] = useState('')
  const wait = getPageState(progress)
  if (wait) return wait
  if (!progress.data.length) return <p className="empty">No students yet. Add a student first.</p>

  const current = progress.data.find((p) => p.student._id === (sel || progress.data[0].student._id))
  const form = edit ?? current

  const pick = (id) => { setSel(id); setEdit(null); setMsg('') }
  const set = (k) => (e) => { setEdit({ ...form, [k]: e.target.value }); setMsg('') }
  const save = async () => {
    try {
      await api(`/progress/${current.student._id}`, { method: 'PUT', body: form })
      setEdit(null)
      setMsg(`Saved for ${current.student.name}.`)
      progress.reload()
    } catch (e) { setMsg(e.message) }
  }

  return (
    <>
      <header className="head">
        <div>
          <h2>Quran progress</h2>
          <p>Sabaq is the new lesson, Sabqi is recent revision, and Manzil is older revision.</p>
        </div>
      </header>

      {role !== 'student' && (
        <div className="card form">
          <h3>Record today’s lesson</h3>
          <select className="search" value={current.student._id} onChange={(e) => pick(e.target.value)}>
            {progress.data.map((p) => <option key={p.student._id} value={p.student._id}>{p.student.name}</option>)}
          </select>
          <div className="fields">
            <label>Sabaq<input value={form.sabaq} onChange={set('sabaq')} /></label>
            <label>Sabqi<input value={form.sabqi} onChange={set('sabqi')} /></label>
            <label>Manzil<input value={form.manzil} onChange={set('manzil')} /></label>
          </div>
          <label>Teacher remark<textarea rows={2} value={form.remark} onChange={set('remark')} /></label>
          <button className="btn solid" onClick={save}>Save lesson</button>
          {msg && <small className={msg.startsWith('Saved for') ? 'success-message' : 'error'}>{msg}</small>}
        </div>
      )}

      <div className="cards">
        {progress.data.map((p) => (
          <div className="card" key={p._id}>
            <h3>{p.student.name}</h3>
            <small>{p.student.course}</small>
            <dl>
              <dt>Sabaq</dt><dd>{p.sabaq || '—'}</dd>
              <dt>Sabqi</dt><dd>{p.sabqi || '—'}</dd>
              <dt>Manzil</dt><dd>{p.manzil || '—'}</dd>
            </dl>
            {p.remark && <p className="remark">{p.remark}</p>}
          </div>
        ))}
      </div>
    </>
  )
}

export function StudentHome({ user }) {
  const progress = useApi('/progress')
  const classes = useApi('/classes')
  const assignments = useApi('/assignments')
  const wait = getPageState(progress, classes, assignments)
  if (wait) return wait

  const p = progress.data[0]
  const next = classes.data[0]

  return (
    <>
      <header className="head">
        <div>
          <h1>Assalamu alaikum, {user.name.split(' ')[0]}</h1>
          <p>Your next class and what to practise.</p>
        </div>
      </header>

      <section className="grid2">
        <div className="card">
          <h3>Next class</h3>
          {next ? (
            <>
              <strong>{next.name}</strong>
              <small>{next.teacher} · {next.time}</small>
              <p style={{ marginTop: '.8rem' }}>
                <a className="btn solid" href={next.link} target="_blank" rel="noreferrer">Join on {next.platform}</a>
              </p>
            </>
          ) : <p className="empty">No classes scheduled yet.</p>}
        </div>
        <div className="card">
          <h3>Today’s lesson</h3>
          {p ? (
            <dl>
              <dt>Sabaq</dt><dd>{p.sabaq || '—'}</dd>
              <dt>Sabqi</dt><dd>{p.sabqi || '—'}</dd>
              <dt>Manzil</dt><dd>{p.manzil || '—'}</dd>
            </dl>
          ) : <p className="empty">Your teacher has not recorded a lesson yet.</p>}
        </div>
      </section>

      <div className="card">
        <h3>Due soon</h3>
        {assignments.data.slice(0, 3).map((a) => (
          <div className="row" key={a._id}>
            <div><strong>{a.title}</strong><small>{a.classroom}</small></div>
            <i className="tag gold">Due {a.due}</i>
          </div>
        ))}
        {!assignments.data.length && <p className="empty">Nothing due. Well done.</p>}
      </div>
    </>
  )
}
