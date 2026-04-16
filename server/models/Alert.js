const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  placeId: mongoose.Schema.Types.ObjectId,
  placeName: String,
  title: String,
  description: String,
  severity: String, // LOW, MEDIUM, HIGH
  type: String, // flood, landslide, coastal, dam
  timestamp: { type: Date, default: Date.now },
  
  // Status tracking fields
  status: { 
    type: String, 
    enum: ["pending", "verified", "published", "rejected"], 
    default: "published" 
  },
  submittedBy: String, // Email or user ID
  submittedAt: Date,
  verifiedBy: String, // Admin ID
  verifiedAt: Date,
  isPublished: { 
    type: Boolean, 
    default: true 
  }
});

module.exports = mongoose.model("Alert", alertSchema);
