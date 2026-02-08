const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  placeId: mongoose.Schema.Types.ObjectId,
  placeName: String,
  title: String,
  description: String,
  severity: String, // LOW, MEDIUM, HIGH
  type: String, // flood, landslide, coastal, dam
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
