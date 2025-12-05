const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * INCIDENT MODEL (ĐÃ UPDATE: BỎ TEAM -> GÁN CHO USER)
 */

// --- Các Sub-Schemas NHÚNG ---

const IncidentImageSchema = new Schema({
  image_url: { type: String, required: true },
  uploader_id: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['before', 'during', 'after'], default: 'before' },
  description: { type: String }
}, { _id: false, timestamps: { createdAt: 'uploaded_at' } });

const IncidentUpdateSchema = new Schema({
  updater_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  update_time: { type: Date, default: Date.now },
  status_from: { type: String },
  status_to: { type: String, required: true },
  note: { type: String },
  visible_to_citizen: { type: Boolean, default: true }
}, { _id: false });

// SỬA: Lịch sử phân công giờ gán cho 'assignee_id' (User) thay vì 'team_id'
const IncidentAssignmentSchema = new Schema({
  assignee_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Người được giao (Technician)
  assigned_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Người giao (Manager)
  assigned_at: { type: Date, default: Date.now },
  note: { type: String }
}, { _id: false });

const IncidentRatingSchema = new Schema({
  rater_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  created_at: { type: Date, default: Date.now }
}, { _id: false });


// --- Schema CHÍNH (Incident) ---

const incidentSchema = new Schema({
  // Người báo cáo
  reporter_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Loại sự cố
  type_id: {
    type: Schema.Types.ObjectId,
    ref: 'IncidentType',
    required: true
  },
  
  // SỬA: Thay 'assigned_team_id' bằng 'assigned_to' (User)
  assigned_to: { 
    type: Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu thẳng tới User (Technician)
    default: null,
    index: true
  },

  // Dữ liệu lõi
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  status: {
    type: String,
    required: true,
    enum: ['reported', 'assigned', 'in_progress', 'completed', 'reopened', 'rejected'],
    default: 'reported'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  address: { type: String, required: true },
  location: { // GeoJSON
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true
    }
  },

  // Dữ liệu NHÚNG
  images: [IncidentImageSchema],
  updates: [IncidentUpdateSchema],
  assignments: [IncidentAssignmentSchema], 
  rating: IncidentRatingSchema

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);