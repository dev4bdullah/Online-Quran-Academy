import { Router } from 'express'
import { Student, Classroom, Assignment, Metric } from '../models.js'
import { protect, allow } from '../middleware/auth.js'

const router = Router()
router.use(protect, allow('admin', 'teacher'))

router.get('/', async (req, res) => {
  const [students, classes, assignments, trend] = await Promise.all([
    Student.find(),
    Classroom.find(),
    Assignment.find(),
    Metric.find().sort('order'),
  ])

  const attendance = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)
    : 0

  res.json({
    totals: { students: students.length, classes: classes.length, attendance, assignments: assignments.length },
    trend,
    classPerformance: assignments.map((a) => ({
      name: a.classroom,
      completion: a.total ? Math.round((a.submitted / a.total) * 100) : 0,
    })),
    attention: students.filter((s) => s.attendance < 90 || s.fee === 'Pending'),
  })
})

export default router
