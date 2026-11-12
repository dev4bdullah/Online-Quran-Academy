import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/login', async (req, res) => {
  const { email = '', password = '' } = req.body ?? {}
  const normalizedEmail = email.trim()
  const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const user = await User.findOne({ email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } })

  if (!user || !(await bcrypt.compare(password, user.password)) || !['admin', 'teacher'].includes(user.role)) {
    return res.status(401).json({ message: 'Email or password is incorrect.' })
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId },
  })
})

router.get('/me', protect, (req, res) => res.json(req.user))

export default router
