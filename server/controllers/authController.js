import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, College } from '../models/index.js';

export const register = async (req, res) => {
  try {
    const { email, password, role, ...otherData } = req.body;

    const existingUser =
      role === 'college'
        ? await College.findOne({ email })
        : await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      ...otherData,
      email,
      password: hashedPassword,
    };

    const newUser =
      role === 'college'
        ? await College.create(userData)
        : await User.create(userData);

    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role,
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role,
        fullName: newUser.fullName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let role = 'user';

    if (!user) {
      user = await College.findOne({ email });
      role = 'college';
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    console.log(user)
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
