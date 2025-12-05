const mongoose = require('mongoose');
const { Schema } = mongoose;


const IncidentImageSchema = new Schema({
  image_url: { type: String, required: true },
  uploader_id: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['before', 'during', 'after'], default: 'before' },
  description: { type: String }
}, { _id: false, timestamps: true });

const IncidentUpdateSchema = new Schema({
  updater_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status_from: String,
  status_to: { type: String, required: true },
  note: String,
  update_time: { type: Date, default: Date.now },
  visible_to_citizen: { type: Boolean, default: true }
}, { _id: false });

const IncidentAssignmentSchema = new Schema({
  engineer_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assigned_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assigned_at: { type: Date, default: Date.now },
  note: String
}, { _id: false });

const IncidentRatingSchema = new Schema({
  rater_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  created_at: { type: Date, default: Date.now }
}, { _id: false });

const incidentSchema = new Schema({

  reporter_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: String,
    required: true,
    enum: ["pothole", "trash", "broken_light", "flooding", "other"]
  },

  assigned_engineer_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  title: { type: String, required: true },
  description: { type: String, required: true },

  status: {
    type: String,
    enum: ['reported', 'assigned', 'in_progress', 'completed', 'reopened', 'rejected'],
    default: 'reported'
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },

  address: { type: String, required: true },

  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },

  images: [IncidentImageSchema],
  updates: [IncidentUpdateSchema],
  assignments: [IncidentAssignmentSchema],
  rating: IncidentRatingSchema

}, {
  timestamps: true
});

incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);
