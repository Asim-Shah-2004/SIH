import express from 'express';
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getConnections,
} from '../controllers/connectionController.js';

const connectionRouter = express.Router();

connectionRouter.post('/send', sendConnectionRequest);
connectionRouter.post('/accept', acceptConnectionRequest);
connectionRouter.post('/reject', rejectConnectionRequest);
connectionRouter.get('/all', getConnections);

export default connectionRouter;
