import express from 'express';
import {
  getAllEvents,
  addEvent,
  deleteEvent,
  deleteParticipant,
  registerForEvent,
} from '../controllers/eventController.js';

const eventRouter = express.Router();

eventRouter.get('/', getAllEvents);
eventRouter.post('/add', addEvent);
eventRouter.post('/:id/register', registerForEvent);
eventRouter.post('/:id/delete', deleteParticipant);
eventRouter.post('/delete', deleteEvent);

export default eventRouter;
