const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  placeId: mongoose.Schema.Types.ObjectId,
  placeName: String,
  name: String, // NDRF, Fire Brigade, Police, Hospital, etc
  type: String, // rescue, medical, police, fire
  location: {
    latitude: Number,
    longitude: Number
  },
  availability: Boolean,
  contact: String,
  responseTime: String, // in minutes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resource", resourceSchema);
