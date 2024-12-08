import { User } from '../models/index.js';

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

export { getAllUsers, getUser, getAllUsersExceptConnections, getDonations };
