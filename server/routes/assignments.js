import { Router } from 'express'
import { Assignment } from '../models.js'
import { protect, allow } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.get('/', async (req, res) => {
  const filter = req.user.role === 'student'
    ? { $or: [{ student: null }, { student: req.user.studentId }] }
    : {}
  res.json(await Assignment.find(filter).sort('due'))
})

router.post('/', allow('admin', 'teacher', 'student'), async (req, res) => {
  if (req.user.role === 'student' && !req.user.studentId) {
    return res.status(400).json({ message: 'Your account is not linked to a student profile.' })
  }

  const assignment = req.user.role === 'student'
    ? { ...req.body, student: req.user.studentId, submitted: 0, total: 1 }
    : req.body

  res.status(201).json(await Assignment.create(assignment))
})

router.delete('/:id', allow('admin', 'teacher'), async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default router
