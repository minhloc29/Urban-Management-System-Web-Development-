const mongoose = require('mongoose');
const { Schema } = mongoose;

const permissionSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true 
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Permission', permissionSchema);