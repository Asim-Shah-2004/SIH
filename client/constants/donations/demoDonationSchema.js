const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    message: { type: String, required: true },
    image: { type: String },
});

const testimonialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    message: { type: String, required: true },
    image: { type: String },
    year: { type: String },
});

const campaignManagerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    contact: { type: String, required: true },
});

const donationCampaignSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: Number, required: true },
    raised: { type: Number, default: 0 },
    donors: { type: Number, default: 0 },
    image: { type: String, required: true },
    deadline: { type: Date, required: true },
    impact: { type: String, required: true },
    category: { type: String, required: true },
    updates: [updateSchema],
    testimonials: [testimonialSchema],
    campaignManager: { type: campaignManagerSchema, required: true },
    taxBenefits: { type: String },
    minimumDonation: { type: Number, required: true },
    suggestedDonations: { type: [Number], required: true },
});

module.exports = mongoose.model('DonationCampaign', donationCampaignSchema);
