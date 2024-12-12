import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  image: { type: String, required: true },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  college_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  speakers: [speakerSchema],
  agenda: { type: String, required: true },
  sponsors: [{ type: String }],
  department: [{ type: String, required: true }],
  allowedRange: {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
  },
  registered: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
  ],
  maxCapacity: { type: Number },
  feedback: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    feedback: { type: Object },
  },
  isActive: { type: Boolean, required: true, default: true },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
