import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['text', 'image', 'audio', 'video', 'document'],
    required: true,
  },
  text: { type: String },
  uri: { type: String },
  fileName: { type: String },
  fileSize: { type: Number },
  sender: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

const chatSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }], // Array of email addresses
  messages: [messageSchema],
  lastMessage: { type: String },
  lastMessageTimestamp: { type: Date },
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
