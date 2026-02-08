const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema({
  placeId: mongoose.Schema.Types.ObjectId,
  placeName: String,
  name: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  address: String,
  capacity: Number,
  currentOccupancy: { type: Number, default: 0 },
  facilities: [String], // ['food', 'water', 'medical', 'bathroom']
  contactPerson: String,
  phone: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Shelter", shelterSchema);
