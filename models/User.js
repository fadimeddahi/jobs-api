const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define UserSchema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    maxlength: 50,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
});

// Pre-save middleware to hash the password before saving it to the database
UserSchema.pre('save', async function () {
  // Only hash the password if it's new or modified
  if (!this.isModified('password')) return;
  
  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to retrieve the user's name
UserSchema.methods.createJWT = function () {
    return jwt.sign(
      { userId: this._id , name:this.name},
      process.env.JWT_SECRET, // Secret key for signing the token
      { expiresIn: process.env.JWT_LIFETIME } // Token expiration time
    );
  };

  UserSchema.methods.comparePasswords = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
  };
  
// Export the User model
module.exports = mongoose.model('User', UserSchema);
