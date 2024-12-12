import express from 'express';
import {
  getAllEvents,
  getAllCollegeEvents,
  getAllUserEvents,
  addEvent,
  deleteEvent,
  registerForEvent,
  feedbackForEvent,
  deleteParticipant
} from '../controllers/eventController.js';

const eventRouter = express.Router();

eventRouter.get('/', getAllEvents);
eventRouter.get('/college/:college_id', getAllCollegeEvents);
eventRouter.get('/user/:userId/:college_id', getAllUserEvents);
eventRouter.post('/:college_id', addEvent);
eventRouter.delete('/:college_id', deleteEvent);

eventRouter.post('/register/:event_id/:userId', registerForEvent);
eventRouter.post('/feedback/:event_id/:userId', feedbackForEvent);
eventRouter.delete('/delete/:event_id/:userId', deleteParticipant);


export default eventRouter;
