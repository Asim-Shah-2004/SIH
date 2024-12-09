const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // College name
  email: { type: String, required: true, unique: true }, // Login email for the college
  password: { type: String, required: true }, // Hashed password for secure login
  logo: { type: String }, // URL or path to the college logo
  address: { type: String }, // College address
  website: { type: String }, // Official website URL
  contactNumber: { type: String }, // College contact number

  // Prestigious Information
  accreditation: { type: String }, // Accreditation info (e.g., NAAC, NBA)
  ranking: { type: String }, // College ranking info
  establishedYear: { type: Number }, // Year the college was established
  coursesOffered: { type: [String] }, // List of courses offered

  // Branding
  missionStatement: { type: String }, // Mission statement of the college
  visionStatement: { type: String }, // Vision statement of the college
  tagline: { type: String }, // College tagline
  banners: [{ type: String }], // URLs of promotional banners or images

  // Connection with Alumni System
  alumniCount: { type: Number, default: 0 }, // Total number of alumni
  registeredAlumni: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked alumni users
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('College', collegeSchema);
