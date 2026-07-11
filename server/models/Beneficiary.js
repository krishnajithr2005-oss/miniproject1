const mongoose = require("mongoose");

const beneficiarySchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      enum: ["volunteer", "shelter", "alert"],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    district: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    approvedBy: String,
    approvedAt: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Beneficiary", beneficiarySchema);
