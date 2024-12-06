import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  logo: { type: String },
  address: { type: String },
  website: { type: String },
  contactNumber: { type: String },
  accreditation: { type: String },
  ranking: { type: String },
  establishedYear: { type: Number },
  coursesOffered: [String],
  missionStatement: { type: String },
  visionStatement: { type: String },
  tagline: { type: String },
  banners: [String],
  alumniCount: { type: Number, default: 0 },
  registeredAlumni: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

const College = mongoose.model('College', collegeSchema);

export default College;
