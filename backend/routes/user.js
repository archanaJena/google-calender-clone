import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
});

// Get user settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('settings');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return default settings if none exist
    const defaultSettings = {
      language: 'en',
      region: 'US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
      defaultView: 'month',
      weekStartsOn: 0,
      timeFormat: '12h'
    };
    
    res.json({ settings: user.settings || defaultSettings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ 
      message: 'Error fetching settings', 
      error: error.message 
    });
  }
});

// Update user settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Merge existing settings with updates
    const currentSettings = user.settings || {};
    user.settings = { ...currentSettings, ...updates };
    await user.save();

    res.json({ 
      message: 'Settings updated successfully',
      settings: user.settings 
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ 
      message: 'Error updating settings', 
      error: error.message 
    });
  }
});

export default router;

