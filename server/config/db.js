import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { User } from '../models.js'

let embedded

export default async function connectDB() {
  let uri = process.env.MONGO_URI

  if (!uri || uri === 'embedded') {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data')
    fs.mkdirSync(dbPath, { recursive: true })
    embedded = await MongoMemoryServer.create({
      instance: { port: 27017, dbPath, storageEngine: 'wiredTiger' },
    })
    uri = embedded.getUri('online-quran-academy')
    console.log('Built-in MongoDB running at localhost:27017 (data saved in server/data)')
  }

  await mongoose.connect(uri)
  console.log('MongoDB connected')
}

export async function ensureDefaultTeacher() {
  if (process.env.NODE_ENV === 'production') return
  if (!mongoose.connection.readyState) return

  const existing = await User.estimatedDocumentCount()
  if (existing > 0) return

  const email = (process.env.TUTOR_EMAIL || 'teacher@oqa.com').trim().toLowerCase()
  const password = process.env.TUTOR_PASSWORD || 'tutor123'
  const name = (process.env.TUTOR_NAME || 'Ustaza Maryam').trim()

  await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 12),
    role: 'teacher',
  })

  console.log(`Created default teacher account for ${email}.`)
}

export async function disconnectDB() {
  await mongoose.disconnect()
  if (embedded) await embedded.stop(false)
}
