import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  updateComment,
  deleteComment,
  toggleLike,
  addReaction
} from '../controllers/postController.js';

const postRouter = express.Router();

postRouter.post('/', createPost);
postRouter.delete('/:id', deletePost);
postRouter.get('/', getPosts);
// postRouter.get('/:id', getPostById);
// postRouter.put('/:id', updatePost);

postRouter.post('/:postId/comments', addComment);
postRouter.delete('/:postId/comments/:commentId', deleteComment);
postRouter.post('/:postId/likes', toggleLike);

export default postRouter;