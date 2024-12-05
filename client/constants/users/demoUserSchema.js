const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true }, // Full name of the user
  email: { type: String, required: true, unique: true }, // Unique email
  password: { type: String, required: true }, // The actual password (hashed)
  isUniversityGeneratedPassword: { type: Boolean, default: true }, // Tracks if the password is still the default
  profilePhoto: { type: String }, // URL or path to profile photo

  // Resume-related fields
  phone: { type: String }, // Phone number
  address: { type: String }, // Address extracted from the resume
  education: [
    {
      degree: { type: String },
      institution: { type: String },
      yearOfGraduation: { type: Number, default: null }, // null indicates ongoing
    },
  ],
  workExperience: [
    {
      companyName: { type: String },
      role: { type: String },
      startDate: { type: Date },
      endDate: { type: Date, default: null }, // null indicates ongoing
      description: { type: String },
    },
  ],
  skills: { type: [String] }, // Array of skills
  projects: [
    {
      title: { type: String },
      description: { type: String },
      link: { type: String },
    },
  ],
  certifications: [
    {
      name: { type: String },
      issuingOrganization: { type: String },
      issueDate: { type: Date },
    },
  ],
  languages: { type: [String] }, // Languages the user knows

  // Location
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },

  // Connections and requests
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of connected users
  receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users who sent connection requests
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users to whom requests were sent

  notifications: { type: [String] }, // Array of notification messages

  bio: { type: String }, // Short bio or summary
  interests: { type: [String] }, // List of interests
  website: { type: String }, // Personal or professional website

  createdAt: { type: Date, default: Date.now }, // Date of account creation
});

module.exports = mongoose.model('User', userSchema);
