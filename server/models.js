import mongoose from 'mongoose'
const { Schema, model } = mongoose

export const Student = model('Student', new Schema({
  name: { type: String, required: true, trim: true },
  course: { type: String, required: true },
  teacher: { type: String, default: '' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  attendance: { type: Number, default: 100, min: 0, max: 100 },
  fee: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
}, { timestamps: true }))

export const User = model('User', new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
}, { timestamps: true }))

export const Classroom = model('Classroom', new Schema({
  name: { type: String, required: true, trim: true },
  teacher: { type: String, required: true },
  time: { type: String, required: true },
  students: { type: Number, default: 0 },
  platform: { type: String, enum: ['Google Meet', 'Zoom'], default: 'Google Meet' },
  link: { type: String, required: true },
}, { timestamps: true }))

export const Assignment = model('Assignment', new Schema({
  title: { type: String, required: true, trim: true },
  classroom: { type: String, required: true },
  due: { type: String, required: true },
  submitted: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  student: { type: Schema.Types.ObjectId, ref: 'Student', default: null },
}, { timestamps: true }))

export const Progress = model('Progress', new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
  sabaq: { type: String, default: '' },
  sabqi: { type: String, default: '' },
  manzil: { type: String, default: '' },
  remark: { type: String, default: '' },
}, { timestamps: true }))

const attendanceSchema = new Schema({
  classroom: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
  date: { type: String, required: true },
  records: [{
    _id: false,
    student: { type: Schema.Types.ObjectId, ref: 'Student' },
    present: Boolean,
  }],
})
attendanceSchema.index({ classroom: 1, date: 1 }, { unique: true })
export const Attendance = model('Attendance', attendanceSchema)

export const Metric = model('Metric', new Schema({
  month: String,
  rate: Number,
  enrolled: Number,
  order: Number,
}))
