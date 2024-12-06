import express from 'express';
import morgan from 'morgan';
import logger from './utils/logger.js';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectMongoDB } from './services/index.js';
import {
  eventRouter,
  jobRouter,
  donationRouter,
  authRouter,
  connectionRouter,
  userRouter,
  mediaGetRouter,
  mediaUploadRouter,
  chatRouter,
} from './routers/index.js';
import { authenticateToken } from './middleware/authenticateToken.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  },
});

const PORT = 3000;
const rooms = {};

connectMongoDB();

app.use(express.json());
app.use(morgan('dev'));

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('/auth', authRouter);
app.use('/media', mediaGetRouter);

app.use(authenticateToken);

app.use('/media', mediaUploadRouter);
app.use('/events', eventRouter);
app.use('/jobs', jobRouter);
app.use('/donations', donationRouter);
app.use('/connections', connectionRouter);
app.use('/users', userRouter);
app.use('/chat', chatRouter);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

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
