import { Router } from 'express'
import { Attendance } from '../models.js'
import { protect, allow } from '../middleware/auth.js'

const router = Router()
router.use(protect, allow('admin', 'teacher'))

router.get('/', async (req, res) => {
  const { classroom, date } = req.query
  const doc = await Attendance.findOne({ classroom, date })
  res.json(doc ? doc.records : [])
})

router.put('/', async (req, res) => {
  const { classroom, date, records } = req.body
  const doc = await Attendance.findOneAndUpdate(
    { classroom, date },
    { records },
    { new: true, upsert: true }
  )
  res.json(doc)
})

export default router
