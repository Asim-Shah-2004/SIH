import express from 'express';
import {
  getAllEvents,
  getEventById,
  addEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getRegisteredUsers,
} from '../controllers/eventController.js';

const eventRouter = express.Router();

eventRouter.get('/', getAllEvents);
eventRouter.get('/:id', getEventById);
eventRouter.post('/', addEvent);
eventRouter.put('/:id', updateEvent);
eventRouter.delete('/:id', deleteEvent);
eventRouter.post('/:id/register', registerForEvent);
eventRouter.get('/:id/registered', getRegisteredUsers);

export default eventRouter;
