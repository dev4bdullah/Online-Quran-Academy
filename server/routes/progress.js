import { Router } from 'express'
import { Progress } from '../models.js'
import { protect, allow } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.get('/', async (req, res) => {
  let filter = {}
  if (req.user.role === 'student') {
    if (!req.user.studentId) return res.json([])
    filter = { student: req.user.studentId }
  }
  res.json(await Progress.find(filter).populate('student', 'name course'))
})

router.put('/:studentId', allow('admin', 'teacher'), async (req, res) => {
  const { sabaq, sabqi, manzil, remark } = req.body
  const saved = await Progress.findOneAndUpdate(
    { student: req.params.studentId },
    { sabaq, sabqi, manzil, remark },
    { new: true, upsert: true }
  ).populate('student', 'name course')
  res.json(saved)
})

export default router
