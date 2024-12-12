import { Event, User } from '../models/index.js';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import createEmailTemplate from '../services/mailServiceEvents.js';

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getAllCollegeEvents = async (req, res) => {
  try {
    const { college_id } = req.params;

    const events = await Event.find({ college_id }).populate({
      path: 'registered',
      select:
        '_id fullName profilePhoto email phone city state country location education',
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const getAllUserEvents = async (req, res) => {
  try {
    const { userId, college_id } = req.params;

    const events = await Event.find({ college_id }).populate({
      path: 'registered',
      select: '_id fullName profilePhoto email',
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let eligibleEvents = events.filter((event) => {
      return user.education.some((edu) => {
        const isValidDepartment = event.department.includes(edu.department);
        const isValidYear =
          edu.graduationYear >= event.allowedRange.from &&
          edu.graduationYear <= event.allowedRange.to;
        return isValidDepartment && isValidYear;
      });
    });

    eligibleEvents = eligibleEvents.map((event) => ({
      ...event.toObject(),
      isRegistered: event.registered.some(
        (registeredUser) => registeredUser._id.toString() === id
      ),
    }));

    res.status(200).json(eligibleEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

export const addEvent = async (req, res) => {
  try {
    const { college_id } = req.params;
    const newEvent = new Event(req.body);
    newEvent.college_id = college_id;
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res
      .status(400)
      .json({ error: 'Failed to create event', details: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { event_id } = req.params;
    const deletedEvent = await Event.findOneAndDelete({ id: event_id });
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
    const { event_id, userId } = req.params;

    const event = await Event.findById(event_id);
    const user = await User.findById(userId);

    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.registered.includes(userId))
      return res.status(400).json({ error: 'Already registered for event' });

    event.registered.push(userId);
    user.eventsRegistered.push(event_id);
    await event.save();
    await user.save();

    // Generate QR code
    const qrData = JSON.stringify({
      eventId: event._id,
      userId,
      registrationTime: new Date().toISOString(),
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
      to: user.email,
      subject: `Registration Confirmed: ${event.title}`,
      html: createEmailTemplate(user, event, qrCodeDataUrl),
    });

    res
      .status(200)
      .json({ message: 'Registered successfully and confirmation email sent' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: 'Failed to register for event' });
  }
};

export const deleteParticipant = async (req, res) => {
  const { event_id, userId } = req.params;

  const event = await Event.findById(event_id);
  const user = await User.findById(userId);

  event.registered = event.registered.filter((id) => id.toString() !== userId);
  user.eventsRegistered = user.eventsRegistered.filter(
    (eventId) => eventId.toString() !== event_id
  );

  await event.save();
  await user.save();

  res.status(200).json({ message: 'Participant removed successfully' });
};

export const feedbackForEvent = async (req, res) => {
  const { event_id, userId } = req.params;
  const { feedback } = req.body;

  const event = await Event.findById(event_id);
  event.feedback.push({ user: userId, feedback });
  await event.save();

  res.status(200).json({ message: 'Participant removed successfully' });
};
