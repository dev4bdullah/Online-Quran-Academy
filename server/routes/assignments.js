import { Router } from 'express'
import { Assignment } from '../models.js'
import { protect, allow } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.get('/', async (req, res) => {
  res.json(await Assignment.find({}).sort('due'))
})

router.post('/', allow('teacher'), async (req, res) => {
  res.status(201).json(await Assignment.create(req.body))
})

router.delete('/:id', allow('teacher'), async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default router
