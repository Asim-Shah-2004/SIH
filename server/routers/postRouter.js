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
postRouter.get('/', getPosts);
postRouter.get('/:id', getPostById);
postRouter.put('/:id', updatePost);
postRouter.delete('/:id',  deletePost);

postRouter.post('/:postId/comments',  addComment);
postRouter.put('/:postId/comments/:commentId',  updateComment);
postRouter.delete('/:postId/comments/:commentId',  deleteComment);

postRouter.post('/:postId/likes',  toggleLike);
postRouter.post('/:postId/reactions',  addReaction);

export default postRouter;