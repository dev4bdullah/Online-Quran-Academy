import {
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar,
} from 'recharts'
import { useApi } from '../api.js'
import { getPageState } from '../components/ui/LoadingState.jsx'

export default function Analytics() {
  const stats = useApi('/stats')
  const wait = getPageState(stats)
  if (wait) return wait
  const { trend } = stats.data

  return (
    <>
      <header className="head">
        <div>
          <h2>Analytics</h2>
          <p>Enrollment growth over time.</p>
        </div>
      </header>

      <section className="card">
        <h3>Enrollment growth</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trend}>
            <CartesianGrid stroke="#E7E0CF" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="enrolled" fill="#14584A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </>
  )
}
