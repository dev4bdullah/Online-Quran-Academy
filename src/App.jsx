import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { api } from './api.js'
import PortalLayout from './components/layout/PortalLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('oqa-user') || 'null')
      return localStorage.getItem('oqa-token') && ['admin', 'teacher'].includes(savedUser?.role)
        ? savedUser
        : null
    } catch {
      localStorage.removeItem('oqa-token')
      localStorage.removeItem('oqa-user')
      return null
    }
  })
  const navigate = useNavigate()

  const login = async (email, password) => {
    const result = await api('/auth/login', { method: 'POST', body: { email, password } })
    localStorage.setItem('oqa-token', result.token)
    localStorage.setItem('oqa-user', JSON.stringify(result.user))
    setUser(result.user)
    navigate('/')
  }

  const logout = () => {
    localStorage.removeItem('oqa-token')
    localStorage.removeItem('oqa-user')
    setUser(null)
    navigate('/')
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user
          ? <PortalLayout user={user} onLogout={logout}><Dashboard user={user} /></PortalLayout>
          : <Login onLogin={login} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
