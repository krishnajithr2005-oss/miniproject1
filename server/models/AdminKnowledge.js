const mongoose = require("mongoose");

const adminKnowledgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "general",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminKnowledge", adminKnowledgeSchema);
