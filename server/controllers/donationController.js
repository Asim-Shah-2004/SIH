import { DonationCampaign } from '../models/index.js';

export const getAllDonationCampaigns = async (req, res) => {
  try {
    const campaigns = await DonationCampaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donation campaigns' });
  }
};

export const getDonationCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await DonationCampaign.findOne({ id });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.status(200).json(campaign);
  } catch (error) {
    res.status(400).json({ error: 'Invalid campaign ID' });
  }
};

export const addDonationCampaign = async (req, res) => {
  try {
    const newCampaign = new DonationCampaign(req.body);
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create donation campaign',
      details: error.message,
    });
  }
};

export const updateDonationCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCampaign = await DonationCampaign.findOneAndUpdate(
      { id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCampaign)
      return res.status(404).json({ error: 'Campaign not found' });
    res.status(200).json(updatedCampaign);
  } catch (error) {
    res.status(400).json({
      error: 'Invalid campaign ID or failed to update campaign',
      details: error.message,
    });
  }
};

export const deleteDonationCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await DonationCampaign.findOneAndDelete({ id });
    if (!deletedCampaign)
      return res.status(404).json({ error: 'Campaign not found' });
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Invalid campaign ID or failed to delete campaign' });
  }
};
