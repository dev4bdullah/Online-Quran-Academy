import { useCallback, useEffect, useState } from 'react'

const apiBase = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export const getToken = () => localStorage.getItem('oqa-token')

export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken()
  const res = await fetch(apiBase + '/api' + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))

  if (res.status === 401 && token) {
    localStorage.removeItem('oqa-token')
    localStorage.removeItem('oqa-user')
    window.location.href = '/'
  }
  if (!res.ok) throw new Error(data.message || 'Request failed.')
  return data
}

export function useApi(path) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    api(path)
      .then((d) => { setData(d); setError('') })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [path])

  useEffect(() => { load() }, [load])
  return { data, error, loading, reload: load }
}
