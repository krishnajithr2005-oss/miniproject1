const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  placeId: mongoose.Schema.Types.ObjectId,
  placeName: String,
  title: String,
  description: String,
  severity: String, // LOW, MEDIUM, HIGH
  type: String, // flood, landslide, coastal, dam
  district: String,
  eventDate: Date,
  timestamp: { type: Date, default: Date.now },
  
  // Status tracking fields
  status: { 
    type: String, 
    enum: ["pending", "verified", "published", "rejected"], 
    default: "pending" 
  },
  submittedBy: String, // Email or user ID
  submittedAt: Date,
  verifiedBy: String, // Admin ID
  verifiedAt: Date,
  isPublished: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.model("Alert", alertSchema);
