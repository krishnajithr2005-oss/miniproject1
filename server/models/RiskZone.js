const mongoose = require("mongoose");

const riskZoneSchema = new mongoose.Schema({
  placeId: mongoose.Schema.Types.ObjectId,
  placeName: String,
  riskType: String, // flood, landslide, coastal, dam
  severity: String, // LOW, MEDIUM, HIGH
  coordinates: {
    type: {
      type: String,
      enum: ["Polygon"],
      default: "Polygon"
    },
    coordinates: [[[Number]]] // GeoJSON format - array of arrays of coordinates
  },
  description: String,
  affectedAreas: [String],
  createdAt: { type: Date, default: Date.now }
});

riskZoneSchema.index({ "coordinates": "2dsphere" });

module.exports = mongoose.model("RiskZone", riskZoneSchema);
