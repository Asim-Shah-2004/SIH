import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
},{Collection : "userss"});

// Create a compound unique index to prevent duplicate entries
UserSchema.index({ name: 1, year: 1, department: 1 }, { unique: true });

const Userss =  mongoose.model('userss', UserSchema);

export default Userss;