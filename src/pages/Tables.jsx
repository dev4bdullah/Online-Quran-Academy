import { useEffect, useState } from 'react'
import { api, useApi } from '../api.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import { getPageState } from '../components/ui/LoadingState.jsx'

export function StudentsPage() {
  const students = useApi('/students')
  const [q, setQ] = useState('')
  const [form, setForm] = useState(null)
  const [msg, setMsg] = useState('')
  const wait = getPageState(students)
  if (wait) return wait

  const list = students.data.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()))
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const save = async () => {
    try {
      const { _id, ...details } = form
      const payload = {
        ...details,
        attendance: Number(details.attendance),
        progress: Number(details.progress),
      }
      await api(_id ? `/students/${_id}` : '/students', {
        method: _id ? 'PUT' : 'POST',
        body: payload,
      })
      setForm(null)
      setMsg('')
      students.reload()
    } catch (e) { setMsg(e.message) }
  }
  const remove = async (id) => {
    if (!window.confirm('Remove this student?')) return
    try {
      await api(`/students/${id}`, { method: 'DELETE' })
      students.reload()
    } catch (e) { setMsg(e.message) }
  }

  return (
    <>
      <PageHeader
        title="Students"
        sub="Everyone enrolled, with progress and fee status."
        action="Add student"
        onAction={() => setForm({
          name: '', course: 'Qaida', teacher: '', fee: 'Pending', progress: 0, attendance: 100,
        })}
      />

      {form && (
        <div className="card form">
          <h3>{form._id ? 'Update student details' : 'Add a student'}</h3>
          <div className="fields">
            <label>Name<input value={form.name} onChange={set('name')} /></label>
            <label>Course
              <select value={form.course} onChange={set('course')}>
                {['Qaida', 'Nazra', 'Tajweed', 'Hifz'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Teacher<input value={form.teacher} onChange={set('teacher')} /></label>
            <label>Quran progress (%)<input type="number" min="0" max="100" value={form.progress} onChange={set('progress')} /></label>
            <label>Attendance (%)<input type="number" min="0" max="100" value={form.attendance} onChange={set('attendance')} /></label>
            <label>Fee
              <select value={form.fee} onChange={set('fee')}>
                <option>Pending</option><option>Paid</option>
              </select>
            </label>
          </div>
          {msg && <small className="error">{msg}</small>}
          <div className="cta">
            <button className="btn solid" onClick={save}>{form._id ? 'Save changes' : 'Add student'}</button>
            <button className="btn" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {msg && !form && <small className="error">{msg}</small>}
      <input className="search" placeholder="Search students" value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="card table">
        <table>
          <thead>
            <tr><th>Name</th><th>Course</th><th>Teacher</th><th>Progress</th><th>Attendance</th><th>Fee</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s._id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.course}</td>
                <td>{s.teacher}</td>
                <td><ProgressBar value={s.progress} /></td>
                <td>{s.attendance}%</td>
                <td><i className={'tag ' + (s.fee === 'Paid' ? 'ok' : 'gold')}>{s.fee}</i></td>
                <td className="right">
                  <button className="link" onClick={() => { setForm({ ...s }); setMsg('') }}>Edit</button>
                  <button className="link danger-link" onClick={() => remove(s._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="empty">No students match that search. Try a different name.</p>}
      </div>
    </>
  )
}

export function ClassesPage() {
  const classes = useApi('/classes')
  const [form, setForm] = useState(null)
  const [msg, setMsg] = useState('')
  const wait = getPageState(classes)
  if (wait) return wait

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const save = async () => {
    try {
      const { _id, ...details } = form
      await api(_id ? `/classes/${_id}` : '/classes', {
        method: _id ? 'PUT' : 'POST',
        body: { ...details, students: Number(details.students) },
      })
      setForm(null)
      setMsg('')
      classes.reload()
    } catch (e) { setMsg(e.message) }
  }
  const remove = async (id) => {
    if (!window.confirm('Remove this class?')) return
    try {
      await api(`/classes/${id}`, { method: 'DELETE' })
      classes.reload()
    } catch (e) { setMsg(e.message) }
  }

  return (
    <>
      <PageHeader
        title="Classes"
        sub="Plan lessons, keep your meeting links handy, and make it easy to join."
        action="Add a class"
        onAction={() => setForm({ name: '', teacher: '', time: '', platform: 'Google Meet', link: '', students: 0 })}
      />

      {form && (
        <div className="card form">
          <h3>{form._id ? 'Edit class' : 'Schedule a class'}</h3>
          <div className="fields">
            <label>Class name<input value={form.name} onChange={set('name')} /></label>
            <label>Teacher<input value={form.teacher} onChange={set('teacher')} /></label>
            <label>Timing<input placeholder="Mon–Fri, 5:00 PM" value={form.time} onChange={set('time')} /></label>
            <label>Platform
              <select value={form.platform} onChange={set('platform')}>
                <option>Google Meet</option><option>Zoom</option>
              </select>
            </label>
            <label>Meeting link<input placeholder="https://" value={form.link} onChange={set('link')} /></label>
            <label>Number of students<input type="number" min="0" value={form.students} onChange={set('students')} /></label>
          </div>
          {msg && <small className="error">{msg}</small>}
          <div className="cta">
            <button className="btn solid" onClick={save}>{form._id ? 'Save changes' : 'Save class'}</button>
            <button className="btn" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
      {msg && !form && <small className="error">{msg}</small>}

      <div className="cards">
        {classes.data.map((c) => (
          <div className="card" key={c._id}>
            <h3>{c.name}</h3>
            <p>{c.teacher}</p>
            <small>{c.time} · {c.students} students</small>
            <a className="btn solid" href={c.link} target="_blank" rel="noreferrer">Join on {c.platform}</a>
            <div className="cta">
              <button className="link" onClick={() => { setForm({ ...c }); setMsg('') }}>Edit class</button>
              <button className="link danger-link" onClick={() => remove(c._id)}>Remove class</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export function AttendancePage() {
  const students = useApi('/students')
  const classes = useApi('/classes')
  const [classId, setClassId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [marks, setMarks] = useState({})
  const [msg, setMsg] = useState('')
  const cid = classId || classes.data?.[0]?._id

  useEffect(() => {
    if (!cid) return
    setMsg('')
    let active = true
    api(`/attendance?classroom=${cid}&date=${date}`)
      .then((rows) => { if (active) setMarks(Object.fromEntries(rows.map((r) => [r.student, r.present]))) })
      .catch((e) => { if (active) setMsg(e.message) })
    return () => { active = false }
  }, [cid, date])

  const wait = getPageState(students, classes)
  if (wait) return wait

  const isPresent = (id) => marks[id] ?? true
  const present = students.data.filter((s) => isPresent(s._id)).length

  const save = async () => {
    if (!cid) {
      setMsg('Add a class before recording attendance.')
      return
    }
    const records = students.data.map((s) => ({ student: s._id, present: isPresent(s._id) }))
    try {
      await api('/attendance', { method: 'PUT', body: { classroom: cid, date, records } })
      setMsg('Attendance saved.')
    } catch (e) { setMsg(e.message) }
  }

  return (
    <>
      <PageHeader
        title="Attendance"
        sub={`${present} of ${students.data.length} present on this date.`}
        action={cid ? 'Save attendance' : null}
        onAction={save}
      />
      <div className="cta">
        <select className="search" value={cid || ''} onChange={(e) => setClassId(e.target.value)} disabled={!classes.data.length}>
          {classes.data.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input className="search" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      {msg && <small className={msg === 'Attendance saved.' ? 'success-message' : 'error'}>{msg}</small>}
      {!classes.data.length && <p className="empty">Add a class before marking attendance.</p>}
      <div className="card table">
        <table>
          <tbody>
            {students.data.map((s) => (
              <tr key={s._id}>
                <td><strong>{s.name}</strong></td>
                <td>{s.course}</td>
                <td className="right">
                  <button
                    className={'toggle ' + (isPresent(s._id) ? 'on' : 'off')}
                    onClick={() => setMarks({ ...marks, [s._id]: !isPresent(s._id) })}
                  >
                    {isPresent(s._id) ? 'Present' : 'Absent'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function AssignmentsPage({ role }) {
  const assignments = useApi('/assignments')
  const classes = useApi('/classes')
  const [form, setForm] = useState(null)
  const [msg, setMsg] = useState('')
  const wait = getPageState(assignments, classes)
  if (wait) return wait

  const staff = role !== 'student'
  const actionLabel = role === 'teacher'
    ? 'Assign assignment'
    : role === 'student'
      ? 'Upload assignment'
      : 'New assignment'
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const save = async () => {
    try {
      await api('/assignments', {
        method: 'POST',
        body: { ...form, total: Number(form.total) },
      })
      setForm(null)
      setMsg('')
      assignments.reload()
    } catch (e) { setMsg(e.message) }
  }
  const remove = async (id) => {
    if (!window.confirm('Remove this assignment?')) return
    try {
      await api(`/assignments/${id}`, { method: 'DELETE' })
      assignments.reload()
    } catch (e) { setMsg(e.message) }
  }

  return (
    <>
      <PageHeader
        title="Assignments"
        sub="Track what is due and who has submitted."
        action={classes.data.length ? actionLabel : null}
        onAction={() => setForm({
          title: '',
          classroom: classes.data[0]?.name || '',
          due: '',
          total: staff ? 10 : 1,
        })}
      />

      {form && (
        <div className="card form">
          <h3>{actionLabel}</h3>
          <div className="fields">
            <label>Title<input value={form.title} onChange={set('title')} /></label>
            <label>Class
              <select value={form.classroom} onChange={set('classroom')}>
                {classes.data.map((c) => <option key={c._id}>{c.name}</option>)}
              </select>
            </label>
            <label>Due date<input type="date" value={form.due} onChange={set('due')} /></label>
            {staff && (
              <label>Students in class<input type="number" value={form.total} onChange={set('total')} /></label>
            )}
          </div>
          {msg && <small className="error">{msg}</small>}
          <div className="cta">
            <button className="btn solid" onClick={save}>{role === 'teacher' ? 'Assign assignment' : role === 'student' ? 'Upload assignment' : 'Save assignment'}</button>
            <button className="btn" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}
      {msg && !form && <small className="error">{msg}</small>}

      <div className="card table">
        <table>
          <thead>
            <tr><th>Title</th><th>Class</th><th>Due</th><th>Submitted</th>{staff && <th></th>}</tr>
          </thead>
          <tbody>
            {assignments.data.map((a) => (
              <tr key={a._id}>
                <td><strong>{a.title}</strong></td>
                <td>{a.classroom}</td>
                <td>{a.due}</td>
                <td>
                  <ProgressBar value={a.total ? Math.round((a.submitted / a.total) * 100) : 0} />
                  <small>{a.submitted}/{a.total}</small>
                </td>
                {staff && <td className="right"><button className="link" onClick={() => remove(a._id)}>Remove</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
        {!assignments.data.length && <p className="empty">No assignments yet. Create the first one.</p>}
      </div>
    </>
  )
}
