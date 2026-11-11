const exampleJwtSecret = 'replace-this-with-a-long-random-string-123456789'

export function validateProductionConfig() {
  if (process.env.NODE_ENV !== 'production') return

  const secret = process.env.JWT_SECRET || ''
  if (secret.length < 32 || secret === exampleJwtSecret) {
    throw new Error('Production requires a unique JWT_SECRET of at least 32 characters.')
  }

  const mongoUri = process.env.MONGO_URI?.trim()
  if (!mongoUri || mongoUri === 'embedded') {
    throw new Error('Production requires a persistent MongoDB connection in MONGO_URI.')
  }
}
