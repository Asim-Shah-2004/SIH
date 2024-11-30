const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    image: { type: String, required: true },
});

const eventSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    speakers: [speakerSchema],
    agenda: { type: String, required: true },
    sponsors: [{ type: String }],
    registeredCount: { type: Number, required: true },
    maxCapacity: { type: Number, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
