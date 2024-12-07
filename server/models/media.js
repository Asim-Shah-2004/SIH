import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'audio', 'video', 'document'],
    required: true,
  },
  buffer: {
    type: String,
    required: true,
  },
  mimeType: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Media = mongoose.model('Media', mediaSchema);

export default Media;
