import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  likes: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const ReactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['like', 'love', 'wow', 'haha', 'sad', 'angry'], required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  media: [
    {
      type: { type: String, enum: ['image', 'video', 'audio', 'file'], required: true },
      url: { type: String, required: true },
      description: { type: String },
    },
  ],
  likes: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
  ],
  comments: [CommentSchema],
  reactions: [ReactionSchema],
  shares: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      sharedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model('Post', PostSchema);