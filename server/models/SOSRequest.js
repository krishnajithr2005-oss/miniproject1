const mongoose = require('mongoose');

const SOSRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  emergencyType: {
    type: String,
    enum: ['flood', 'landslide', 'fire', 'medical', 'trapped', 'other'],
    default: 'other'
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'responding', 'resolved', 'cancelled'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'high'
  },
  responders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  responseNotes: [{
    note: String,
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: String
  }
}, {
  timestamps: true
});

SOSRequestSchema.index({ district: 1, status: 1 });
SOSRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SOSRequest', SOSRequestSchema);
