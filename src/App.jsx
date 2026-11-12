import { useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { api } from './api.js'
import PortalLayout from './components/layout/PortalLayout.jsx'
import Login from './pages/Login.jsx'
import { StudentsPage, ClassesPage, AttendancePage, AssignmentsPage } from './pages/Tables.jsx'
import { ProgressPage } from './pages/Progress.jsx'

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
    navigate('/students')
  }

  const logout = () => {
    localStorage.removeItem('oqa-token')
    localStorage.removeItem('oqa-user')
    setUser(null)
    navigate('/login')
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/students" replace /> : <Login onLogin={login} />} />
      <Route path="/" element={user ? <PortalLayout user={user} onLogout={logout} /> : <Navigate to="/login" replace />}>
        <Route index element={<Navigate to="/students" replace />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="assignments" element={<AssignmentsPage role={user?.role} />} />
        <Route path="progress" element={<ProgressPage role={user?.role} />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/students' : '/login'} replace />} />
    </Routes>
  )
}
