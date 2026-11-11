import { useState } from 'react'
import { api, useApi } from '../api.js'
import PageHeader from '../components/ui/PageHeader.jsx'
import { getPageState } from '../components/ui/LoadingState.jsx'

export default function TeachersPage() {
  const teachers = useApi('/teachers')
  const [form, setForm] = useState(null)
  const [message, setMessage] = useState('')
  const wait = getPageState(teachers)
  if (wait) return wait

  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value })
    setMessage('')
  }

  const saveTeacher = async () => {
    try {
      await api('/teachers', { method: 'POST', body: form })
      setForm(null)
      setMessage('')
      teachers.reload()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const removeTeacher = async (id) => {
    if (!window.confirm('Remove this teacher account?')) return
    try {
      await api(`/teachers/${id}`, { method: 'DELETE' })
      teachers.reload()
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <>
      <PageHeader
        title="Teachers"
        sub="Manage teacher accounts and their access to the academy portal."
        action="Add teacher"
        onAction={() => setForm({ name: '', email: '', password: '' })}
      />

      {form && (
        <div className="card form">
          <h3>New teacher</h3>
          <div className="fields">
            <label>
              Name
              <input value={form.name} onChange={updateField('name')} />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={updateField('email')} />
            </label>
            <label>
              Temporary password
              <input type="password" value={form.password} onChange={updateField('password')} />
            </label>
          </div>
          {message && <small className="error">{message}</small>}
          <div className="cta">
            <button className="btn solid" onClick={saveTeacher}>Save teacher</button>
            <button className="btn" onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {message && !form && <p className="empty error">{message}</p>}

      <div className="card table">
        <table>
          <thead>
            <tr><th>Name</th><th>Login email</th><th>Password</th><th></th></tr>
          </thead>
          <tbody>
            {teachers.data.map((teacher) => (
              <tr key={teacher._id}>
                <td><strong>{teacher.name}</strong></td>
                <td>{teacher.email}</td>
                <td><i className="tag ok">Set</i></td>
                <td className="right">
                  <button className="link" onClick={() => removeTeacher(teacher._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!teachers.data.length && <p className="empty">No teacher accounts yet. Add the first teacher.</p>}
      </div>
    </>
  )
}
