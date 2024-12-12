import bcrypt from 'bcrypt';
import { User, College } from '../models/index.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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
      id: college._id,
      collegeData: college
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

    const hashedPassword = await bcrypt.hash(password, SALT);

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
      id: user._id,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

// Function to generate a strong random password
const generateRandomPassword = (length = 12) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// Function to send welcome email
const sendWelcomeEmail = async (email, password, fullName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to College Portal',
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #f4f4f4;
          border-radius: 10px;
        }
        .header { 
          background-color: #4a4a4a; 
          color: white; 
          text-align: center; 
          padding: 20px;
          border-radius: 10px 10px 0 0;
        }
        .content { 
          background-color: white; 
          padding: 20px; 
          border-radius: 0 0 10px 10px;
        }
        .credentials { 
          background-color: #f0f0f0; 
          padding: 15px; 
          border-radius: 5px; 
          margin: 20px 0;
        }
        .footer { 
          text-align: center; 
          color: #777; 
          margin-top: 20px; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to College Portal</h1>
        </div>
        <div class="content">
          <h2>Hello ${fullName},</h2>
          <p>Welcome to our College Portal! We're excited to have you on board.</p>
          
          <div class="credentials">
            <h3>Your Login Credentials:</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${password}</p>
            <p><em>Please change your password after first login.</em></p>
          </div>
          
          <p>To get started:</p>
          <ol>
            <li>Visit our portal at [PORTAL_URL]</li>
            <li>Log in with the credentials above</li>
            <li>Update your password in the profile settings</li>
          </ol>
          
          <p>If you have any questions, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} College Portal. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
};

export const bulkCreateUsers = async (req, res) => {
  const uploadedUsers = [];
  const failedUsers = [];

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
        // Generate random password
        const randomPassword = generateRandomPassword();

        // Hash the password
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // Normalize user data
        const normalizedUserData = {
          fullName: userData.fullName || '',
          email: userData.email || '',
          password: hashedPassword, // Store hashed password
          profilePhoto: userData.profilePhoto || '',
          phone: userData.phone || '',
          city: userData.city || '',
          state: userData.state || '',
          country: userData.country || '',
          // Normalize education (handle array-like structure)
          education: Array.isArray(userData['education[0]'])
            ? userData['education[0]'].map(edu => ({
              degree: edu.degree || '',
              department: edu.department || '',
              institution: edu.institution || '',
              graduationYear: parseInt(edu.graduationYear) || null,
              college_id: edu.college_id || null,
              college_email: edu.college_email || '',
              isVerified: edu.isVerified === 'TRUE'
            }))
            : [],

          // Normalize work experience
          workExperience: Array.isArray(userData['workExperience[0]'])
            ? userData['workExperience[0]'].map(work => ({
              companyName: work.companyName ? work.companyName.replace(/"/g, '') : '',
              role: work.role ? work.role.replace(/"/g, '') : '',
              startDate: work.startDate ? new Date(work.startDate) : null,
              endDate: work.endDate ? new Date(work.endDate) : null,
              description: work.description || ''
            }))
            : [],

          // Normalize skills (handle array-like structure)
          skills: [
            userData['skills[0]'],
            userData['skills[1]'],
            userData['skills[2]'],
            userData['skills[3]'],
            userData['skills[4]']
          ].filter(skill => skill && skill.trim() !== ''),

          // Normalize interests
          interests: [
            userData['interests[0]'],
            userData['interests[1]'],
            userData['interests[2]']
          ].filter(interest => interest && interest.trim() !== ''),

          about: userData.about || '',
        };

        // Check for existing user
        const existingUser = await User.findOne({ email: normalizedUserData.email });

        let user;
        if (existingUser) {
          // Update existing user
          existingUser.set(normalizedUserData);
          user = await existingUser.save();
          console.log(`Updated user: ${user.fullName}`);
        } else {
          // Create new user
          user = new User(normalizedUserData);
          await user.save();
          console.log(`Created user: ${user.fullName}`);
        }

        // Send welcome email (with random password)
        await sendWelcomeEmail(normalizedUserData.email, randomPassword, normalizedUserData.fullName);

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