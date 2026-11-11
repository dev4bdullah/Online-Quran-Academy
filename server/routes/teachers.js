import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models.js'
import { protect, allow } from '../middleware/auth.js'

const router = Router()
router.use(protect, allow('admin'))

router.get('/', async (req, res) => {
  const teachers = await User.find({ role: 'teacher' })
    .select('name email createdAt')
    .sort('name')
  res.json(teachers.map((teacher) => ({
    _id: teacher._id,
    id: teacher._id,
    name: teacher.name,
    email: teacher.email,
    passwordSet: true,
  })))
})

router.post('/', async (req, res) => {
  const { name = '', email = '', password = '' } = req.body ?? {}
  const normalizedEmail = email.trim().toLowerCase()

  if (!name.trim() || !normalizedEmail || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' })
  }

  const existing = await User.findOne({ email: normalizedEmail })
  if (existing) return res.status(409).json({ message: 'An account with this email already exists.' })

  const teacher = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: await bcrypt.hash(password, 10),
    role: 'teacher',
  })

  res.status(201).json({
    id: teacher._id,
    name: teacher.name,
    email: teacher.email,
    role: teacher.role,
  })
})

router.delete('/:id', async (req, res) => {
  const teacher = await User.findOneAndDelete({ _id: req.params.id, role: 'teacher' })
  if (!teacher) return res.status(404).json({ message: 'Teacher not found.' })
  res.json({ ok: true })
})

export default router
