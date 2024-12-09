import { DonationCampaign, User, Transaction } from '../models/index.js';
import mongoose from 'mongoose';

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

export const donateToCampaign = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { email } = req.user;
    const { amount, transactionMethod } = req.body;

    const user = await User.findOne({ email }).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    const campaign = await DonationCampaign.findOne({ id }).session(session);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const transaction = new Transaction({
      user: user._id,
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
  } finally {
    session.endSession();
  }
};

export const getDonors = async (req, res) => {
  try {
    console.log('getDonors');

    const { id } = req.params;
    console.log(id);

    const campaign = await DonationCampaign.findById(id).populate({
      path: 'transactions',
      select: 'amount transactionDate transactionMethod',
      populate: {
        path: 'user',
        select: '_id fullName profilePhoto',
      },
    });
    console.log(campaign);
    res.status(200).json(campaign.transactions);
  }
  catch (error) {
    res.status(400).json({
      error: 'Failed to get donor',
      details: error.message,
    });
  }
}



