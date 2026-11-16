import { Router } from 'express'
import { Student, Progress } from '../models.js'
import { protect, allow } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.get('/', allow('teacher'), async (req, res) => {
  const students = await Student.find().sort('name').lean()
  res.json(students)
})

router.post('/', allow('teacher'), async (req, res) => {
  const student = await Student.create(req.body)
  await Progress.create({ student: student._id })
  res.status(201).json(student)
})

router.put('/:id', allow('teacher'), async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!student) return res.status(404).json({ message: 'Student not found.' })
  res.json(student)
})

router.delete('/:id', allow('teacher'), async (req, res) => {
  await Student.findByIdAndDelete(req.params.id)
  await Progress.deleteOne({ student: req.params.id })
  res.json({ ok: true })
})

export default router
