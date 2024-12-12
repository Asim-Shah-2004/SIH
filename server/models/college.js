import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  logo: { type: String, required: true },
  address: { type: String },
  website: { type: String },
  contactNumber: { type: String },
  accreditation: { type: String, default: '' },
  ranking: { type: String, default: '' },
  establishedYear: { type: String, default: 1947 },
  missionStatement: { type: String, default: '' },
  visionStatement: { type: String, default: '' },
  tagline: { type: String, default: '' },
  gallery: [String],
  registeredAlumni: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  alumni_emails: [{ type: String }],
  requestForAlumniPortal: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const College = mongoose.model('College', collegeSchema);

export default College;
