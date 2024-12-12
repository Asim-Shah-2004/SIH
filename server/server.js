import express from 'express';
import morgan from 'morgan';
import logger from './utils/logger.js';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Chat from './models/chat.js';

import { connectMongoDB } from './services/index.js';
import {
  eventRouter,
  jobRouter,
  donationCampaignRouter,
  authRouter,
  connectionRouter,
  userRouter,
  mediaGetRouter,
  mediaUploadRouter,
  chatRouter,
  postRouter,
  groupRouter,
  collegeRouter,
} from './routers/index.js';
import { socketAuthMiddleware } from './middleware/socketAuthMiddleware.js';
import User from './models/user.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  },
});

io.use(socketAuthMiddleware);

const PORT = 3000;
const rooms = {};

connectMongoDB();

app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  })
);

app.use('/auth', authRouter);
app.use('/media', mediaGetRouter);
app.use('/group', groupRouter);
app.use('/users', userRouter);
app.use('/donationcampaigns', donationCampaignRouter);
app.use('/media', mediaUploadRouter);
app.use('/events', eventRouter);
app.use('/jobs', jobRouter);
app.use('/connections', connectionRouter);
app.use('/users', userRouter);
app.use('/chat', chatRouter);
app.use('/posts', postRouter);
app.use('/college', collegeRouter);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

io.on('connection', (socket) => {
  const userEmail = socket.user.email;

  socket.on('joinChat', async (chatId) => {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      if (!chat.participants.includes(userEmail)) {
        socket.emit('error', { message: 'Unauthorized to join this chat' });
        return;
      }

      socket.join(chatId);

      logger.info(`User ${userEmail} joined chat: ${chatId}`);
    } catch (error) {
      logger.error(`Error joining chat: ${error.message}`);
    }
  });

  socket.on('leaveChat', (chatId) => {
    socket.leave(chatId);
    logger.info(`User ${socket.id} left chat: ${chatId}`);
  });

  socket.on('sendMessage', async ({ chatId, message }) => {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      // Check if user is a participant
      if (!chat.participants.includes(socket.user.email)) {
        socket.emit('error', {
          message: 'Unauthorized to send messages in this chat',
        });
        return;
      }

      // Add sender information to message
      message.sender = socket.user.email;

      chat.messages.push(message);
      chat.lastMessage = message.text || `${message.type} message`;
      chat.lastMessageTimestamp = new Date(message.timestamp);

      await chat.save();

      const currUser = await User.findOne({ email: socket.user.email });
      message.sender = currUser.fullName;

      // Emit to all users in the chat room except sender
      socket.to(chatId).emit('receiveMessage', message);
    } catch (error) {
      logger.error(`Error sending message: ${error.message}`);
    }
  });

  socket.on('joinRoom', (roomId) => {
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    rooms[roomId].push(socket.id);
    socket.join(roomId);
    logger.info(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('videoFrame', ({ roomId, frame }) => {
    logger.info(`Received frame from ${socket.id} for room ${roomId}`);
    socket.to(roomId).emit('videoFrame', { frame });
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);

    Object.keys(rooms).forEach((roomId) => {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    });
  });
});

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
