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
  isUniversityGeneratedPassword: { type: Boolean, default: true },
  profilePhoto: { type: String },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
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
  skills: { type: [String], required: true },
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
  languages: { type: [String], required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  connections: { type: [requestSchema], default: [] },
  receivedRequests: { type: [requestSchema], default: [] },
  sentRequests: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  notifications: { type: [String], default: [] },
  bio: { type: String },
  interests: { type: [String], required: true },
  website: { type: String },
  chats: [
    {
      chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
      chatType: { type: Boolean, default: false, required: true }, // True for group chat, false for individual chat
      otherParticipant: { type: String },
    },
  ],
  about: { type: String },
  donationHistory: [
    {
      transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
      },
      campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DonationCampaign',
      },
    },
  ],
  posts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    default: [],
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    default: [],
  },
  comments: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;
