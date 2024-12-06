import { User } from '../models/index.js';

const getAllUsers = async (req, res) => {
  console.log('getAllUsers');

  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  console.log('getUser');

  try {
    const user = await User.findOne({ email: req.params.email });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllUsers, getUser };
