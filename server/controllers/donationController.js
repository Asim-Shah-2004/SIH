import { DonationCampaign, User, Transaction } from '../models/index.js';
import mongoose from 'mongoose';

export const getAllCollegeDonationCampaigns = async (req, res) => {
  try {
    const { college_id } = req.params;
    if (!college_id) {
      return res.status(400).json({ error: 'College ID is required' });
    }

    // Fetch the donation campaigns by the provided college_id
    const campaigns = await DonationCampaign.find({ college_id });

    // If no campaigns are found, return a message
    if (campaigns.length === 0) {
      return res
        .status(404)
        .json({ message: 'No donation campaigns found for this college' });
    }

    // Return the campaigns if found
    res.status(200).json(campaigns);
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
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
    const { college_id } = req.params;
    const newCampaign = new DonationCampaign(req.body);
    newCampaign.college_id = college_id;
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to create donation campaign',
      details: error.message,
    });
  }
};

export const deleteDonationCampaign = async (req, res) => {
  try {
    const { college_id } = req.params;
    const deletedCampaign = await DonationCampaign.findOneAndDelete({
      college_id,
    });
    if (!deletedCampaign)
      return res.status(404).json({ error: 'Campaign not found' });
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Invalid campaign ID or failed to delete campaign' });
  }
};

export const donateToCampaign = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { userId, amount, transactionMethod } = req.body;

    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    const campaign = await DonationCampaign.findById(id).session(session);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const transaction = new Transaction({
      user: userId,
      amount,
      transactionMethod,
    });
    await transaction.save({ session });

    campaign.raised += amount;
    campaign.donors += 1;
    campaign.transactions.push(transaction._id);
    await campaign.save({ session });

    user.donationHistory.push({
      transactionId: transaction._id,
      campaignId: campaign._id,
    });
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      message: 'Donation successful',
      transaction: transaction,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({
      error: 'Failed to process donation',
      details: error.message,
    });
    console.log(error);
  } finally {
    session.endSession();
  }
};

export const getDonors = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await DonationCampaign.findById(id).populate({
      path: 'transactions',
      select: 'amount transactionDate transactionMethod',
      populate: {
        path: 'user',
        select: '_id fullName profilePhoto',
      },
    });
    res.status(200).json(campaign.transactions);
  } catch (error) {
    res.status(400).json({
      error: 'Failed to get donor',
      details: error.message,
    });
  }
};
