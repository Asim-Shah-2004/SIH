import mongoose from 'mongoose';
const requestSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  bio: { type: String },
  profilePhoto: { type: String },
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'college'], default: 'user' },
  isUniversityGeneratedPassword: { type: Boolean, default: true },
  profilePhoto: { type: String },
  phone: { type: String },
  address: { type: String },
  education: [
    {
      degree: { type: String },
      institution: { type: String },
      yearOfGraduation: { type: Number, default: null },
    },
  ],
  workExperience: [
    {
      companyName: { type: String },
      role: { type: String },
      startDate: { type: Date },
      endDate: { type: Date, default: null },
      description: { type: String },
    },
  ],
  skills: [String],
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
  languages: [String],
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  connections: [requestSchema],
  receivedRequests: [requestSchema],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: [String],
  bio: { type: String },
  interests: [String],
  website: { type: String },
  chats: [
    {
      chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
      otherParticipant: { type: String },
    },
  ],
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
  },
  about: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;
