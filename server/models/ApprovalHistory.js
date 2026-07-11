const mongoose = require("mongoose");

const approvalHistorySchema = new mongoose.Schema(
  {
    applicationType: {
      type: String,
      enum: ["volunteer", "shelter", "alert"],
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      enum: ["approved", "rejected"],
      required: true,
    },
    performedBy: {
      type: String,
      required: true,
    },
    notes: String,
    performedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

approvalHistorySchema.index({ applicationType: 1, applicationId: 1, performedAt: -1 });

module.exports = mongoose.model("ApprovalHistory", approvalHistorySchema);
