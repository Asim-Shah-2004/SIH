import mongoose from 'mongoose';

const campaignManagerSchema = new mongoose.Schema({
  name: { type: String, required: false },
  role: { type: String, required: false },
  contact: { type: String, required: false },
});

const donationCampaignSchema = new mongoose.Schema({
  college_id: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  title: { type: String, required: false },
  description: { type: String, required: false },
  goal: { type: Number, required: false },
  raised: { type: Number, default: 0 },
  donors: { type: Number, default: 0 },
  image: { type: String, required: false },
  deadline: { type: Date, required: false },
  impact: { type: String, required: false },
  category: { type: String, required: false },
  campaignManager: { type: campaignManagerSchema, required: false },
  taxBenefits: { type: String },
  suggestedDonations: { type: [Number], required: false },
  transactions: { type: [mongoose.Schema.Types.ObjectId], ref: 'Transaction' },
});

const DonationCampaign = mongoose.model(
  'DonationCampaign',
  donationCampaignSchema
);

export default DonationCampaign;
