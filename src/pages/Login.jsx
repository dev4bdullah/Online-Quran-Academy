import { useState } from 'react'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onLogin(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-brand">
          <span className="brand-mark" aria-hidden="true">ق</span>
          <span>
            <strong>Quran Academy</strong>
            <small>Teacher workspace</small>
          </span>
        </div>

        <div className="login-intro">
          <span className="eyebrow">TEACHER SIGN IN</span>
          <h1>Welcome back</h1>
          <p>Sign in to manage your students, lessons, and classes.</p>
        </div>
        <form className="form" onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn solid login-submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="login-footer">“My Lord, increase me in knowledge.” <span>Quran 20:114</span></p>
      </section>
    </main>
  )
}
