import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, College } from '../models/index.js';

export const collegeRegister = async (req, res) => {
  try {
    const { email, password, role, ...otherData } = req.body;

    const existingUser = await College.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      email,
      password: password,
      ...otherData
    };

    const newUser = await College.create(userData)
        

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
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role,
        ...otherData
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

export const collegeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // let user = await User.findOne({ email });
    // let role = 'user';

     const user = await College.findOne({ email });

    console.log(user);
    

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log(user)
    const isValidPassword = password;
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

export const userRegister = async (req, res) => {
  try {
    const { email, password, role, ...otherData } = req.body;

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already registered' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      email,
      password: password,
      ...otherData
    };

    const newUser = await User.create(userData)
        

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
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role,
        ...otherData
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // let user = await User.findOne({ email });
    // let role = 'user';

     const user = await User.findOne({ email });



    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const isValidPassword = password;
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
