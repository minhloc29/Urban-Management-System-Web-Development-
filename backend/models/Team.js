const mongoose = require('mongoose');
const { Schema } = mongoose;

const TeamMemberSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['leader', 'member'],
    default: 'member'
  }
}, { _id: false }); 

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  is_active: {
    type: Boolean,
    default: true
  },
  members: [TeamMemberSchema] 
}, {
  timestamps: { createdAt: 'created_at' }
});

module.exports = mongoose.model('Team', teamSchema);