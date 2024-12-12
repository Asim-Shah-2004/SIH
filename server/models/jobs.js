import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true,
  },
  experience: {
    minYears: { type: Number, required: true },
    maxYears: { type: Number, required: true },
  },
  skills: {
    type: [String],
    required: true,
  },
  benefits: {
    type: [String],
    default: [],
  },
  department: [{ type: String, required: true }],
  vacancies: {
    type: Number,
    default: 1,
  },
  jdPdf: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  college_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
