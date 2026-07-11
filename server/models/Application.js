const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["volunteer", "shelter", "alert"],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    applicantName: String,
    applicantEmail: String,
    district: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    reviewedBy: String,
    notes: String,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

applicationSchema.index({ type: 1, sourceId: 1 }, { unique: true });
applicationSchema.index({ status: 1, submittedAt: -1 });

module.exports = mongoose.model("Application", applicationSchema);
