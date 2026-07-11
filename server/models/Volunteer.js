const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  district: String,
  skillsAndExperience: String,
  documentProof: String,
  userId: String,
  availability: String, // 'full-time', 'part-time', 'weekends'
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] }, // pending, approved, rejected
  approvedBy: String,
  notes: String,
  registrationDate: { type: Date, default: Date.now },
  approvalDate: Date,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Volunteer", volunteerSchema);
