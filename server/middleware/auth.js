import jwt from 'jsonwebtoken'
import { User } from '../models.js'

export async function protect(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Please sign in.' })

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(id).select('-password')
    if (!user) return res.status(401).json({ message: 'Account not found.' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Session expired. Please sign in again.' })
  }
}

export const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: 'You do not have access to this.' })
