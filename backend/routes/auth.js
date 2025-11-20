import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { generateToken } from '../config/passport.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Manual Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Please provide email, password, and name' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() },
        { email: email.toLowerCase(), authMethod: 'google' }
      ]
    });

    if (existingUser) {
      if (existingUser.authMethod === 'google') {
        return res.status(400).json({ 
          message: 'An account with this email already exists. Please use Google sign-in.' 
        });
      }
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name,
      authMethod: 'manual'
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        authMethod: user.authMethod
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
});

// Manual Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      authMethod: 'manual'
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        authMethod: user.authMethod
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error during login', 
      error: error.message 
    });
  }
});

// Google OAuth Routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    try {
      const token = generateToken(req.user._id);
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('Google callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/login?error=authentication_failed`);
    }
  }
);

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        avatar: req.user.avatar,
        authMethod: req.user.authMethod,
        isEmailVerified: req.user.isEmailVerified,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: error.message 
    });
  }
});

// Logout (client-side token removal, but keeping for consistency)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;

