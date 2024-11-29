const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema for Comments
const CommentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    likes: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Schema for Reactions
const ReactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'love', 'wow', 'haha', 'sad', 'angry'], required: true }, // Example reactions
    createdAt: { type: Date, default: Date.now }
});

// Main Post Schema
const PostSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the post
    text: { type: String, required: true }, // Post text
    media: [
        {
            type: { type: String, enum: ['image', 'video', 'audio', 'file'], required: true },
            url: { type: String, required: true }, // URL of the media
            description: { type: String } // Optional description for the media
        }
    ],
    likes: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
        }
    ],
    comments: [CommentSchema], // Embedded comments
    reactions: [ReactionSchema], // Embedded reactions
    shares: [
        {
            userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            sharedAt: { type: Date, default: Date.now }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Create and export the Post model
const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
