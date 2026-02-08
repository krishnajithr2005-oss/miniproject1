const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: String,
  district: String,
  state: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  riskLevel: String, // LOW, MEDIUM, HIGH
  riskScore: Number, // 0-100
  riskColor: String, // #ff3b3b, #ff9f3b, #3bff3b
  activeLayers: {
    flood: Boolean,
    landslide: Boolean,
    coastal: Boolean,
    dam: Boolean
  },
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Place", placeSchema);
