import mongoose from 'mongoose';
import crypto from 'crypto';
import { type } from 'os';

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String, required: true },
  image: { type: String, required: true },
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  speakers: [speakerSchema],
  agenda: { type: String, required: true },
  sponsors: [{ type: String }],
  registeredCount: { type: Number, default: 0 },
  registered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
  maxCapacity: { type: Number },
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
