import mongoose from 'mongoose';
import {Post} from "../models/index.js";

export const createPost = async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.user.id,
      text: req.body.text,
      media: req.body.media || [],
    });
    
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { userId, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = userId ? { userId: mongoose.Types.ObjectId(userId) } : {};
    
    const posts = await Post.aggregate([
      { $match: query },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          text: 1,
          media: 1,
          likes: 1,
          comments: 1,
          createdAt: 1,
          'user.username': 1,
          'user.profilePicture': 1
        }
      }
    ]);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('userId', 'username profilePicture')
      .populate('comments.userId', 'username profilePicture');
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    post.text = req.body.text || post.text;
    post.media = req.body.media || post.media;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = {
      userId: req.user.id,
      text: req.body.text,
      createdAt: Date.now()
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json(post.comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.text = req.body.text;
    comment.updatedAt = Date.now();

    await post.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (
      comment.userId.toString() !== req.user.id && 
      post.userId.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.remove();
    await post.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const likeIndex = post.likes.findIndex(
      like => like.userId.toString() === req.user.id
    );

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push({ userId: req.user.id });
    }

    await post.save();
    res.status(200).json(post.likes);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addReaction = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const existingReactionIndex = post.reactions.findIndex(
      reaction => reaction.userId.toString() === req.user.id
    );

    if (existingReactionIndex > -1) {
      post.reactions[existingReactionIndex].type = req.body.type;
    } else {
      post.reactions.push({
        userId: req.user.id,
        type: req.body.type
      });
    }

    await post.save();
    res.status(201).json(post.reactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};