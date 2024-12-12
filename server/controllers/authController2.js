import { User, College } from '../models/index.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f6f9;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            background: linear-gradient(135deg, #6366F1, #4F46E5);
            color: white;
            text-align: center;
            padding: 30px 20px;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 30px 20px;
        }
        .email-body p {
            color: #4a5568;
            margin-bottom: 20px;
        }
        .verify-button {
            display: block;
            width: 220px;
            margin: 30px auto;
            padding: 15px 25px;
            background-color: #6366F1;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            transition: background-color 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .verify-button:hover {
            background-color: #4F46E5;
        }
        .footer {
            background-color: #f4f6f9;
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #718096;
        }
        .logo {
            width: 60px;
            height: 60px;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <svg class="logo" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="30" r="30" fill="white" fill-opacity="0.2"/>
                <path d="M30 15L40 25H35V40H25V25H20L30 15Z" fill="white"/>
            </svg>
            <h1>Verify Your Email Address</h1>
        </div>
        <div class="email-body">
            <p>Hello!</p>
            <p>You're almost there. Click the button below to verify your college email address. This helps us ensure the authenticity of your account.</p>
            <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
            <p>If you didn't request this verification, you can safely ignore this email. The verification link will expire in 24 hours.</p>
            <p>Need help? Contact our support team.</p>
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} Your Company. All rights reserved.
        </div>
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
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verified!</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        height: 100%;
                        font-family: 'Inter', sans-serif;
                        background: linear-gradient(135deg, #6366F1, #4F46E5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        overflow: hidden;
                    }
                    .container {
                        background: white;
                        border-radius: 20px;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                        text-align: center;
                        padding: 40px;
                        max-width: 500px;
                        position: relative;
                        z-index: 10;
                        transform: scale(0.9);
                        opacity: 0;
                        animation: popIn 0.6s ease-out forwards;
                    }
                    @keyframes popIn {
                        0% {
                            transform: scale(0.6);
                            opacity: 0;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                    .checkmark {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        background: #4CAF50;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin: 0 auto 20px;
                        animation: pulse 1.5s infinite;
                    }
                    .checkmark svg {
                        width: 50px;
                        height: 50px;
                        fill: white;
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                    h1 {
                        color: #2D3748;
                        margin-bottom: 15px;
                        font-size: 2rem;
                    }
                    p {
                        color: #4A5568;
                        margin-bottom: 20px;
                        line-height: 1.6;
                    }
                    .confetti-container {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: 1;
                    }
                    .confetti {
                        width: 15px;
                        height: 15px;
                        background-color: #f1f1f1;
                        position: absolute;
                        left: 50%;
                        animation: fall 3s linear infinite;
                        transform-origin: bottom;
                    }
                    @keyframes fall {
                        to {
                            transform: 
                                translateY(100vh) 
                                rotate(360deg);
                        }
                    }
                </style>
            </head>
            <body>
                <div class="confetti-container" id="confetti"></div>
                <div class="container">
                    <div class="checkmark">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    </div>
                    <h1>Email Verified!</h1>
                    <p>Congratulations! Your college email has been successfully verified. You can now access all features of our platform.</p>
                </div>
        
                <script>
                    function createConfetti() {
                        const container = document.getElementById('confetti');
                        const colors = ['#6366F1', '#4F46E5', '#f1f1f1', '#4CAF50', '#FF6B6B'];
                        
                        for (let i = 0; i < 100; i++) {
                            const confetti = document.createElement('div');
                            confetti.classList.add('confetti');
                            
                            // Randomize properties
                            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                            confetti.style.left = 55;
                            confetti.style.animationDelay = 2;
                            confetti.style.transform = rotate(150deg);
                            
                            container.appendChild(confetti);
                        }
                    }
        
                    // Create confetti when page loads
                    createConfetti();
                </script>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({
            success: false,
            error: 'Verification failed',
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        console.log(user);

        let role = 'user';

        if (!user) {
            user = await College.findOne({ email });
            role = 'college';
        }

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        console.log(user)
        // const isValidPassword = await bcrypt.compare(password, user.password);
        // if (!isValidPassword) {
        //     return res.status(400).json({ message: 'Invalid credentials' });
        // }

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
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
        console.log(error);

    }
};