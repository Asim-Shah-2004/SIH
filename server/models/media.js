import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['audio', 'video'],
    required: true,
  },
  buffer: {
    type: Buffer,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Media = mongoose.model('Media', mediaSchema);

export default Media;
