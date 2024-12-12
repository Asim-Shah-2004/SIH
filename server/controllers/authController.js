import bcrypt from 'bcrypt';
import { User, College } from '../models/index.js';

const SALT = Number(process.env.SALT_ROUNDS)

export const collegeRegister = async (req, res) => {
  try {
    const { name, email, password, ...otherData } = req.body;

    const existingUser = await College.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'College already registered',
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    const collegeData = {
      name,
      email,
      password: hashedPassword,
      ...otherData,
    };

    const newCollege = await College.create(collegeData);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      id: newCollege._id,
      collegeData: newCollege
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

export const collegeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const college = await College.findOne({ email });
    if (!college) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, college.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      id: newCollege._id,
      collegeData: newCollege
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const userRegister = async (req, res) => {
  try {
    const { email, password, ...otherData } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const hashedPassword =  await bcrypt.hash(password, SALT);

    const userData = {
      email,
      password: hashedPassword,
      ...otherData,
    };

    const newUser = await User.create(userData);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      id: newUser._id,
      user: newUser
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      id: newUser._id,
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const bulkCreateUsers = async (req, res) => {
  const uploadedUsers = []; // Track successfully uploaded users
  const failedUsers = []; // Track users that failed to upload

  try {
    const users = req.body;
    console.log('Received users:', JSON.stringify(users, null, 2));

    // Validate input
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        error: 'Invalid user data',
        message: 'No users provided or invalid data format',
      });
    }

    // Process users one by one
    for (const userData of users) {
      try {
        // Check for existing user
        const existingUser = await Userss.findOne({
          name: userData.name,
          year: userData.year,
          department: userData.department,
        });

        let user;
        if (existingUser) {
          // Update existing user
          existingUser.set(userData);
          user = await existingUser.save();
          console.log(`Updated user: ${user.name}`);
        } else {
          // Create new user
          user = new Userss(userData);
          await user.save();
          console.log(`Created user: ${user.name}`);
        }

        // Log successful upload
        uploadedUsers.push(user);
      } catch (userError) {
        // Log failed user
        console.error(
          `Failed to process user: ${JSON.stringify(userData)}`,
          userError
        );
        failedUsers.push({
          userData,
          error: userError.message,
        });
      }
    }

    console.log(
      `Bulk upload summary - Total: ${users.length}, Successful: ${uploadedUsers.length}, Failed: ${failedUsers.length}`
    );

    // Prepare response
    res.status(201).json({
      message: 'Users processed',
      details: {
        totalUsers: users.length,
        successful: uploadedUsers.length,
        failed: failedUsers.length,
      },
      failedUsers: failedUsers, // Optional: return details of failed uploads
    });
  } catch (error) {
    console.error('Bulk user creation error:', error);

    res.status(500).json({
      error: 'Failed to create users',
      message: error.message,
    });
  }
};
