import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mongoose from 'mongoose'

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

export async function disconnectDB() {
  await mongoose.disconnect()
  if (embedded) await embedded.stop(false)
}
