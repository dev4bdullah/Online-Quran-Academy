import { Router } from 'express'
import { Progress } from '../models.js'
import { protect, allow } from '../middleware/auth.js'

const router = Router()
router.use(protect)

router.get('/', async (req, res) => {
  res.json(await Progress.find({}).populate('student', 'name course'))
})

router.put('/:studentId', allow('teacher'), async (req, res) => {
  const { sabaq, sabqi, manzil, remark } = req.body
  const saved = await Progress.findOneAndUpdate(
    { student: req.params.studentId },
    { sabaq, sabqi, manzil, remark },
    { new: true, upsert: true }
  ).populate('student', 'name course')
  res.json(saved)
})

export default router
