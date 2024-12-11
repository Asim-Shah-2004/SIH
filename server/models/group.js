import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePhoto: { type: String },
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
