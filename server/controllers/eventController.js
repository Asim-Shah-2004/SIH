import { Event } from '../models/index.js';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import createEmailTemplate from '../services/mailServiceEvents.js';

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findOne({ id });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: 'Invalid event ID' });
  }
};

export const addEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Failed to create event', details: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await Event.findOneAndUpdate({ id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent)
      return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({
      error: 'Invalid event ID or failed to update event',
      details: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params; deletedEvent = await Event.findOneAndDelete({ id });
    if (!deletedEvent)
      return res.status(404).json({ error: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Invalid event ID or failed to delete event' });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const event = await Event.findOne({ _id: id });
    
    if (!event) return res.status(404).json({ error: 'Event not found' });
    
    // Check if user is already registered
    if (event.registered.includes(userId)) {
      return res.status(400).json({ error: 'Already registered for this event' });
    }
    
    event.registered.push(userId);
    event.registeredCount += 1;
    await event.save();

    // Generate QR code
    const qrData = JSON.stringify({
      eventId: event._id,
      userId: userId,
      registrationTime: new Date().toISOString()
    });
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrData);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.APP_PASSWORD,
      },
  });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: req.user.email,
      subject: `Registration Confirmed: ${event.title}`,
      html: createEmailTemplate(req.user, event, qrCodeDataUrl)
    });

    res.status(200).json({ message: 'Registered successfully and confirmation email sent' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Failed to register for event' });
  }
};

export const getRegisteredUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findOne({ _id: id })
      .populate({
        path: 'registered',
        select: '_id fullName profilePhoto'
      })
    if (!event) return res.status(404).json({ error: 'Event not found' })
    return res.status(200).json(event.registered);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch registered users' });
  }
}
