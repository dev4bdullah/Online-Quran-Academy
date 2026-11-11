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
      <section className="login-art" aria-label="Online Quran Academy">
        <div className="login-brand">
          <span className="ar">قرآن</span>
          <span>Online Quran Academy</span>
        </div>
        <div className="login-verse" lang="ar" dir="rtl">وَقُل رَّبِّ زِدْنِي عِلْمًا</div>
        <p>“My Lord, increase me in knowledge.”</p>
        <span className="verse-reference">Quran 20:114</span>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <span className="eyebrow">TUTOR PORTAL</span>
          <h1>Assalamu alaikum</h1>
          <p>Sign in to manage your students, lessons, and classes.</p>
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
              {busy ? 'Signing in…' : 'Sign in to your dashboard'}
            </button>
          </form>
          <small className="login-note">For tutors and academy administrators only.</small>
        </div>
      </section>
    </main>
  )
}
