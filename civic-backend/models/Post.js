const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    issueType: {
      type: String,
      required: true
    },

    department: {
      type: String
    },

    description: {
      type: String
    },

    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    },

    areaName: {
      type: String,
      required: true
    },

    fullAddress: {
      type: String
    },

    image: {
      type: String
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    },

    // 🔥 AI Enhancements
    aiDetected: {
      type: Boolean,
      default: false
    },

    aiConfidence: {
      type: Number
    },

    aiLabels: {
      type: [String]
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },

    inProgressAt: Date,
    resolvedImage: String,
    resolvedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);