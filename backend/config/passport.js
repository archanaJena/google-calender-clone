import dotenv from "dotenv";
dotenv.config();
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      // User exists, return user
      return done(null, user);
    }

    // Check if user exists with this email
    user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      // User exists but doesn't have Google ID, link it
      user.googleId = profile.id;
      user.authMethod = 'google';
      if (!user.avatar) {
        user.avatar = profile.photos[0]?.value;
      }
      await user.save();
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatar: profile.photos[0]?.value,
      authMethod: 'google',
      isEmailVerified: true // Google emails are verified
    });

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

