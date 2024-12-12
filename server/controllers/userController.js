import bcrypt from 'bcrypt';
import { User, LandingPageConfig } from '../models/index.js';

const SALT = Number(process.env.SALT_ROUNDS);

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, SALT);
    await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while changing password',
    });
  }
};

export const getAllUsersExceptConnections = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    // Fetch all users except the current user
    const users = await User.find({ _id: { $ne: user._id } });

    // Create a Set of connection user IDs for quick lookup
    const connectionsSet = new Set(
      user.connections &&
        user.connections.map((connection) => connection._id.toString())
    );

    // Filter users who are not in the connections Set
    const filteredUsers = users.filter(
      (user) => !connectionsSet.has(user._id.toString())
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.find({ _id: { $ne: id } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllAlumni = async (req, res) => {
  const { college_id } = req.params;
  try {
    const users = await User.find({ 
      'education.college_id': college_id,
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDonations = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId )
      .populate({
        path: 'donationHistory.transactionId',
        model: 'Transaction',
        select: '-user',
      })
      .populate({
        path: 'donationHistory.campaignId',
        model: 'DonationCampaign',
        select: 'id title',
      });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const donations = user.donationHistory.map((donation) => ({
      ...donation.transactionId.toObject(),
      campaign: donation.campaignId,
    }));

    res.status(200).json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const landingPageConfig = async (req, res) => {
  const college_id = req.params.college_id;

  const config = await LandingPageConfig.findById(college_id);

  return res.json(config);
};

