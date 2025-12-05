const mongoose = require('mongoose');
const { Schema } = mongoose;

const incidentTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  icon_url: { 
    type: String
  }
});

module.exports = mongoose.model('IncidentType', incidentTypeSchema);