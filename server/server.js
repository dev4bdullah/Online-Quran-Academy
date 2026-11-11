import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'node:url'
import connectDB, { disconnectDB } from './config/db.js'
import { validateProductionConfig } from './config/runtime.js'
import auth from './routes/auth.js'
import students from './routes/students.js'
import classes from './routes/classes.js'
import assignments from './routes/assignments.js'
import teachers from './routes/teachers.js'
import progress from './routes/progress.js'
import attendance from './routes/attendance.js'
import stats from './routes/stats.js'

validateProductionConfig()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', auth)
app.use('/api/students', students)
app.use('/api/classes', classes)
app.use('/api/assignments', assignments)
app.use('/api/teachers', teachers)
app.use('/api/progress', progress)
app.use('/api/attendance', attendance)
app.use('/api/stats', stats)

const frontendDist = fileURLToPath(new URL('../dist/', import.meta.url))
const frontendIndex = fileURLToPath(new URL('../dist/index.html', import.meta.url))
app.use(express.static(frontendDist))
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found.' })
  }
  if (req.method !== 'GET') return next()
  res.sendFile(frontendIndex, (error) => {
    if (error) next(error)
  })
})

app.use((err, req, res, next) => {
  console.error(err)
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message })
  res.status(500).json({ message: 'Something went wrong on the server.' })
})

await connectDB()
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`API running on http://localhost:${port}`))

const shutdown = async () => {
  await disconnectDB()
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
