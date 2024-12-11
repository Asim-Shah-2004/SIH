import { User } from '../models/index.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASSWORD,
    },
});

const getVerificationEmail = (verificationUrl) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { 
            display: inline-block;
            padding: 12px 24px;
            background-color: #4F46E5;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verify Your Email</h1>
        <p>Click the button below to verify your email address. This link will expire in 24 hours.</p>
        <a href="${verificationUrl}" class="button">Verify Email</a>
        <p>If you didn't request this, please ignore this email.</p>
    </div>
</body>
</html>
`;

export const register = async (req, res) => {
    try {
        const { user } = req.body;

        // Validate the user object
        if (!user || typeof user !== 'object') {
            return res.status(400).json({ 
                success: false, 
                error: 'User object must be provided' 
            });
        }

        // Normalize and validate emails from education array
        const emails = user.education 
            ? user.education.map(edu => edu.college_email.toLowerCase().trim())
            : [];

        if (emails.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'At least one college email is required' 
            });
        }

        const results = await Promise.all(emails.map(async (email) => {
            try {
                // Check if a user with this college email already exists
                let existingUser = await User.findOne({ 
                    'education.college_email': email 
                });
                
                if (existingUser) {
                    return { 
                        email, 
                        status: 'failed', 
                        error: 'College email already registered' 
                    };
                }

                // Generate verification token for each education email
                const educationEntries = user.education.map(edu => {
                    if (edu.college_email.toLowerCase().trim() === email) {
                        const verificationToken = crypto.randomBytes(32).toString('hex');
                        return {
                            ...edu,
                            verificationToken,
                            verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                            isVerified: false
                        };
                    }
                    return edu;
                });

                // Create the user with the updated education array
                const newUser = await User.create({
                    ...user,
                    education: educationEntries
                });

                // Generate verification URL
                const relevantEducation = newUser.education.find(
                    edu => edu.college_email.toLowerCase().trim() === email
                );
                const verificationUrl = `http://localhost:3000/auth/${encodeURIComponent(email)}/verify?token=${relevantEducation.verificationToken}`;
                
                // Send verification email
                await transporter.sendMail({
                    from: '"Your Company" <noreply@yourcompany.com>',
                    to: email,
                    subject: 'Verify Your College Email Address',
                    html: getVerificationEmail(verificationUrl)
                });

                return { 
                    email, 
                    status: 'success', 
                    message: 'Verification email sent' 
                };
            } catch (error) {
                console.error('Registration error for email:', email, error);
                return { 
                    email, 
                    status: 'failed', 
                    error: error.message 
                };
            }
        }));

        return res.json({
            success: true,
            results,
            summary: {
                total: results.length,
                successful: results.filter(r => r.status === 'success').length,
                failed: results.filter(r => r.status === 'failed').length
            }
        });

    } catch (error) {
        console.error('Registration process failed:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
};

export const verify = async (req, res) => {
    try {
        const { email } = req.params;
        const { token } = req.query;

        if (!email || !token) {
            return res.status(400).json({
                success: false,
                error: 'Email and token are required'
            });
        }

        // Normalize email
        const normalizedEmail = decodeURIComponent(email).toLowerCase().trim();

        // Find user with matching education email and token
        const user = await User.findOne({
            'education.college_email': normalizedEmail,
            'education.verificationToken': token
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'Invalid verification link'
            });
        }

        // Find the specific education entry to verify
        const educationEntry = user.education.find(
            edu => 
                edu.college_email.toLowerCase().trim() === normalizedEmail &&
                edu.verificationToken === token
        );

        // Check token expiration
        if (educationEntry.verificationTokenExpires < new Date()) {
            return res.status(400).json({
                success: false,
                error: 'Verification link has expired'
            });
        }

        // Check if already verified
        if (educationEntry.isVerified) {
            return res.status(400).json({
                success: false,
                error: 'College email is already verified'
            });
        }

        // Update the specific education entry
        educationEntry.isVerified = true;
        educationEntry.verificationToken = null;
        educationEntry.verificationTokenExpires = null;
        educationEntry.verifiedAt = new Date();

        // Save the updated user
        await user.save();

        // Redirect or respond
        return res.json({
            success: true,
            message: 'College email verified successfully'
        });

    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({
            success: false,
            error: 'Verification failed',
            message: error.message
        });
    }
};