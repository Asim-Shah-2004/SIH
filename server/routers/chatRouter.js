import express from 'express';
import {
  getAllChats,
  getChatMessages,
  createNewChat,
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/new', createNewChat);
router.get('/fetch', getAllChats);

router.get('/:chatId/messages', getChatMessages);

export default router;
