import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: function() {
      return !this.googleId; // Email required only for manual auth
    },
    unique: true,
    sparse: true, // Allows multiple null values
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only for manual auth
    },
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  avatar: {
    type: String,
    default: null
  },
  authMethod: {
    type: String,
    enum: ['manual', 'google'],
    required: true,
    default: 'manual'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving (only for manual auth)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.authMethod !== 'manual') {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.authMethod !== 'manual' || !this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user data without sensitive information
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;

