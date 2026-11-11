import { Router } from 'express'
import { Classroom } from '../models.js'
import { protect, allow } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.get('/', async (req, res) => {
  res.json(await Classroom.find().sort('name'))
})

router.post('/', allow('admin', 'teacher'), async (req, res) => {
  res.status(201).json(await Classroom.create(req.body))
})

router.put('/:id', allow('admin', 'teacher'), async (req, res) => {
  const classroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
  if (!classroom) return res.status(404).json({ message: 'Class not found.' })
  res.json(classroom)
})

router.delete('/:id', allow('admin', 'teacher'), async (req, res) => {
  await Classroom.findByIdAndDelete(req.params.id)
  res.json({ ok: true })
})

export default router
