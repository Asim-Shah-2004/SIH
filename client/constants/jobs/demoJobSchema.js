const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], // Example values
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    benefits: {
        type: [String],
        default: [],
    },
    description: {
        type: String,
        required: true,
    },
    postedDate: {
        type: Date,
        required: true,
    },
    department: {
        type: String,
        default: null,
    },
    vacancies: {
        type: Number,
        default: 1,
    },
    requirements: {
        type: [String],
        default: [],
    },
    jdPdf: {
        type: String,
        required: false,
    },
    postedBy: {
        name: {
            type: String,
            required: true,
        },
    },
});

module.exports = mongoose.model('Job', jobSchema);
