const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  district: String,
  role: {
    type: String,
    enum: ['user', 'volunteer', 'admin', 'shelter_operator'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date,
  profile: {
    bio: String,
    avatar: String,
    phone: String
  },
  registrationSource: {
    type: String,
    enum: ['web', 'seed', 'admin'],
    default: 'web'
  }
}, { timestamps: true });

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    district: this.district,
    role: this.role,
    status: this.status,
    registrationDate: this.registrationDate,
    profile: this.profile,
    registrationSource: this.registrationSource
  };
};

module.exports = mongoose.model("User", userSchema);
