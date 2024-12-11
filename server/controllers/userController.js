import bcrypt from "bcrypt"
import { User } from '../models/index.js';

const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id; 

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 8 characters long' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { 
      password: hashedPassword 
    }, { new: true });

    res.status(200).json({ 
      success: true, 
      message: 'Password changed successfully' 
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error occurred while changing password' 
    });
  }
};

const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.status(200).json({ 
        success: true, 
        message: 'Password verified successfully' 
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Incorrect current password' 
      });
    }

  } catch (error) {
    console.error('Password verification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error occurred during password verification' 
    });
  }
};


const getAllUsersExceptConnections = async (req, res) => {
  const id = req.user.id;

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

const getAllUsers = async (req, res) => {
  const id = req.user.id;
  try {
    const users = await User.find({ _id: { $ne: id } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDonations = async (req, res) => {
  try {
    const { email } = req.user;

    const user = await User.findOne({ email })
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

const getDepartments = async (req, res) => {
  try {
    const { college_id } = req.params;

    const users = await User.find({
      'education.college_id': college_id,
    });

    const departments = new Set();
    users.forEach((user) => {
      user.education
        .filter((edu) => edu.college_id.toString() === college_id)
        .forEach((edu) => departments.add(edu.department));
    });

    res.status(200).json(Array.from(departments));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};


export { getAllUsers, getUser, getAllUsersExceptConnections, getDonations ,verifyPassword , changePassword, getDepartments};
