const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  placeId: mongoose.Schema.Types.ObjectId,
  placeName: String,
  eventDate: Date,
  eventType: String, // flood, landslide, coastal, dam
  severity: String, // LOW, MEDIUM, HIGH
  description: String,
  affectedArea: String,
  casualties: Number,
  damageAssessment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("History", historySchema);
