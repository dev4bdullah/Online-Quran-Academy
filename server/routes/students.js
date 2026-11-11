import { Router } from 'express'
import { Student, Progress, User } from '../models.js'
import { protect, allow } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.get('/', allow('admin', 'teacher'), async (req, res) => {
  const students = await Student.find().sort('name').lean()
  const accounts = await User.find({ role: 'student', studentId: { $in: students.map((student) => student._id) } })
    .select('email studentId')
    .lean()
  const accountByStudent = new Map(accounts.map((account) => [String(account.studentId), account]))

  res.json(students.map((student) => {
    const account = accountByStudent.get(String(student._id))
    return {
      ...student,
      loginEmail: account?.email || '',
      passwordSet: Boolean(account),
    }
  }))
})

router.post('/', allow('admin', 'teacher'), async (req, res) => {
  const student = await Student.create(req.body)
  await Progress.create({ student: student._id })
  res.status(201).json(student)
})

router.put('/:id', allow('admin', 'teacher'), async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!student) return res.status(404).json({ message: 'Student not found.' })
  res.json(student)
})

router.delete('/:id', allow('admin', 'teacher'), async (req, res) => {
  await Student.findByIdAndDelete(req.params.id)
  await Progress.deleteOne({ student: req.params.id })
  res.json({ ok: true })
})

export default router
