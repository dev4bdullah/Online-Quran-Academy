import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import connectDB, { disconnectDB } from './config/db.js'
import { Student, User, Classroom, Assignment, Progress, Metric, Attendance } from './models.js'

if (process.env.NODE_ENV === 'production') {
  throw new Error('The sample-data seed is disabled in production.')
}

await connectDB()
await Promise.all([Student, User, Classroom, Assignment, Progress, Metric, Attendance].map((m) => m.deleteMany({})))

const students = await Student.insertMany([
  { name: 'Ayesha Khan', course: 'Hifz', teacher: 'Ustaza Maryam', progress: 62, attendance: 96, fee: 'Paid' },
  { name: 'Hamza Ali', course: 'Nazra', teacher: 'Ustaad Bilal', progress: 48, attendance: 88, fee: 'Pending' },
  { name: 'Fatima Zahra', course: 'Tajweed', teacher: 'Ustaza Maryam', progress: 75, attendance: 92, fee: 'Paid' },
  { name: 'Zain Ahmed', course: 'Qaida', teacher: 'Ustaad Bilal', progress: 30, attendance: 79, fee: 'Pending' },
  { name: 'Maryam Siddiqui', course: 'Hifz', teacher: 'Ustaad Idris', progress: 81, attendance: 98, fee: 'Paid' },
  { name: 'Usman Tariq', course: 'Nazra', teacher: 'Ustaad Idris', progress: 55, attendance: 85, fee: 'Paid' },
])

const lessons = [
  ['Surah Al-Mulk, ayah 16–20', 'Surah Al-Mulk, ayah 1–15', 'Para 29', 'Smooth recitation. Work on the madd in ayah 18.'],
  ['Page 14, lines 1–8', 'Page 13', 'Pages 10–12', 'Improving. Needs more practice on the letter ع.'],
  ['Noon Sakinah rules, part 2', 'Noon Sakinah rules, part 1', 'Makharij review', 'Strong on ikhfa. Revise idgham examples.'],
  ['Qaida Lesson 6', 'Qaida Lesson 5', 'Lessons 1–4', 'Attendance is low. Short daily revision will help.'],
  ['Surah Al-Waqiah, ayah 31–40', 'Surah Al-Waqiah, ayah 1–30', 'Para 28', 'Excellent retention.'],
  ['Page 20, lines 1–6', 'Page 19', 'Pages 15–18', 'Reading pace is steady.'],
]
await Progress.insertMany(students.map((s, i) => ({
  student: s._id, sabaq: lessons[i][0], sabqi: lessons[i][1], manzil: lessons[i][2], remark: lessons[i][3],
})))

await Classroom.insertMany([
  { name: 'Hifz Batch A', teacher: 'Ustaza Maryam', time: 'Mon–Fri, 5:00 PM', students: 12, platform: 'Google Meet', link: 'https://meet.google.com/' },
  { name: 'Nazra Beginners', teacher: 'Ustaad Bilal', time: 'Mon–Thu, 6:30 PM', students: 18, platform: 'Zoom', link: 'https://zoom.us/' },
  { name: 'Tajweed Level 2', teacher: 'Ustaza Maryam', time: 'Tue, Thu, 8:00 PM', students: 9, platform: 'Google Meet', link: 'https://meet.google.com/' },
  { name: 'Noorani Qaida', teacher: 'Ustaad Idris', time: 'Mon–Fri, 4:00 PM', students: 15, platform: 'Zoom', link: 'https://zoom.us/' },
])

await Assignment.insertMany([
  { title: 'Revise Surah Al-Mulk (1–15)', classroom: 'Hifz Batch A', due: '2026-11-03', submitted: 9, total: 12 },
  { title: 'Practice Makharij: Throat letters', classroom: 'Tajweed Level 2', due: '2026-11-04', submitted: 5, total: 9 },
  { title: 'Read Page 12–14 aloud (record)', classroom: 'Nazra Beginners', due: '2026-11-05', submitted: 11, total: 18 },
  { title: 'Qaida Lesson 6 writing', classroom: 'Noorani Qaida', due: '2026-11-06', submitted: 14, total: 15 },
])

await Metric.insertMany([
  ['Jun', 84, 38], ['Jul', 87, 44], ['Aug', 85, 49], ['Sep', 90, 55], ['Oct', 93, 62],
].map(([month, rate, enrolled], order) => ({ month, rate, enrolled, order })))

const password = await bcrypt.hash('tutor123', 10)
await User.insertMany([
  { name: 'Academy Owner', email: 'Tutor@oqa.com', password, role: 'admin' },
  { name: 'Ustaza Maryam', email: 'teacher@oqa.com', password, role: 'teacher' },
  { name: 'Ayesha Khan', email: 'student@oqa.com', password, role: 'student', studentId: students[0]._id },
])

console.log('Seeded. Demo logins (password tutor123): Tutor@oqa.com, teacher@oqa.com, student@oqa.com')
await disconnectDB()
