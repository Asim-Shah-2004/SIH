import mongoose from 'mongoose';
import crypto from 'crypto';

const campaignManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  contact: { type: String, required: true },
});

const donationCampaignSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => crypto.randomUUID(),
    unique: true,
  },
  college_id: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  goal: { type: Number, required: true },
  raised: { type: Number, default: 0 },
  donors: { type: Number, default: 0 },
  image: { type: String, required: true },
  deadline: { type: Date, required: true },
  impact: { type: String, required: true },
  category: { type: String, required: true },
  campaignManager: { type: campaignManagerSchema, required: true },
  taxBenefits: { type: String },
  suggestedDonations: { type: [Number], required: true },
  transactions: { type: [mongoose.Schema.Types.ObjectId], ref: 'Transaction' },
});

const DonationCampaign = mongoose.model(
  'DonationCampaign',
  donationCampaignSchema
);

export default DonationCampaign;
