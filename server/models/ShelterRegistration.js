const mongoose = require("mongoose");

const shelterRegistrationSchema = new mongoose.Schema({
  shelterName: {
    type: String,
    required: true
  },
  ownerName: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  },
  ownerPhone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  amenities: [String], // ['water', 'bathrooms', 'food', etc]
  facilities: [String],
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  contactPerson: String,
  userId: String,
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },
  approvedBy: String,
  submittedDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: Date,
  documentProof: String, // File path or URL
  notes: String // Admin notes during approval
});

module.exports = mongoose.model("ShelterRegistration", shelterRegistrationSchema);
