const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for Comments
const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Main Post Schema
const PostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the post
  text: { type: String, required: true }, // Post text
  media: [
    {
      type: { type: String, enum: ['image', 'video'], required: true },
      url: { type: String, required: true }, // URL of the media
    },
  ],
  likes: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
  comments: [CommentSchema], // Embedded comments
  shares: { type: Number, default: 0 }, // Number
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create and export the Post model
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
