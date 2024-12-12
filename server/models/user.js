import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  // location: { type: String, required: true },
  education: [
    {
      degree: { type: String, required: true },
      department: { type: String, required: true },
      institution: { type: String, required: true },
      graduationYear: { type: Number, default: null, required: true },
      college_id: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
      college_email: { type: String, required: true },
      verificationToken: {
        type: String,
        default: null
      },
      verificationTokenExpires: {
        type: Date,
        default: null
      },
      isVerified: {
        type: Boolean,
        default: false
      },
      verifiedAt: {
        type: Date,
        default: null
      }
    },
  ],
  workExperience: [
    {
      companyName: { type: String },
      role: { type: String },
      startDate: { type: String },
      endDate: { type: String, default: null },
      description: { type: String },
    },
  ],
  skills: { type: [String], required: true },
  // projects: [
  //   {
  //     title: { type: String },
  //     description: { type: String },
  //     link: { type: String },
  //   },
  // ],
  // certifications: [
  //   {
  //     name: { type: String },
  //     issuingOrganization: { type: String },
  //     issueDate: { type: Date },
  //   },
  // ],
  // connections: { type: [requestSchema], default: [] },
  // receivedRequests: { type: [requestSchema], default: [] },
  // sentRequests: {
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  //   default: [],
  // },
  about: { type: String },
  interests: { type: [String], required: true },
  chats: [
    {
      chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
      otherParticipant: { type: String },
    },
  ],
  notifications: { type: [String], default: [] },
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
  // posts:
  // {
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  //   default: [],
  // },
  // likes:
  // {
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  //   default: [],
  // },
  // comments:
  // {
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  //   default: [],
  // },
  eventsRegistered: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
  jobsPosted: [{type: mongoose.Schema.Types.ObjectId, ref: 'Job'}],
  jobsApplied: [{type: mongoose.Schema.Types.ObjectId, ref: 'Job'}],
});

const User = mongoose.model('User', userSchema);

export default User;
