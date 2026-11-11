import 'dotenv/config'
import bcrypt from 'bcryptjs'
import connectDB, { disconnectDB } from './config/db.js'
import { validateProductionConfig } from './config/runtime.js'
import { User } from './models.js'

validateProductionConfig()

const name = (process.env.TUTOR_NAME || '').trim()
const email = (process.env.TUTOR_EMAIL || '').trim().toLowerCase()
const password = process.env.TUTOR_PASSWORD || ''

if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12) {
  throw new Error('Set TUTOR_NAME, a valid TUTOR_EMAIL, and a TUTOR_PASSWORD of at least 12 characters.')
}

await connectDB()
try {
  if (await User.exists({ role: { $in: ['admin', 'teacher'] } })) {
    throw new Error('A tutor account already exists; refusing to create another.')
  }
  if (await User.exists({ email })) {
    throw new Error('An account already uses TUTOR_EMAIL.')
  }

  await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
    role: 'teacher',
  })
  console.log(`Created tutor account for ${email}.`)
} finally {
  await disconnectDB()
}
