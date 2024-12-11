import mongoose from 'mongoose';

// Schema for individual news/event/job item
const commonItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^(https?:\/\/)/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    validate: {
      validator: function(v) {
        return v === '' || /^(https?:\/\/)/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  }
}, { _id: false });

// Job-specific schema extends common item schema
const jobItemSchema = new mongoose.Schema({
  ...commonItemSchema.obj,
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Landing Page Configuration Schema
const landingPageConfigSchema = new mongoose.Schema({
  collegeId: {
    type: String,
    required: true,
    index: true
  },
  heroSection: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      required: true
    },
    backgroundImage: {
      type: String,
      validate: {
        validator: function(v) {
          return /^(https?:\/\/)/.test(v);
        },
        message: props => `${props.value} is not a valid URL!`
      }
    }
  },
  newsroom: {
    type: [commonItemSchema],
    default: []
  },
  events: {
    type: [commonItemSchema],
    default: []
  },
  jobsAndInternships: {
    type: [jobItemSchema],
    default: []
  },
  latestNews: {
    type: [commonItemSchema],
    default: []
  },
  metadata: {
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    version: {
      type: String,
      default: '1.0.0'
    }
  }
}, {
  timestamps: true,
  collection: 'landing_page_configs'
});


landingPageConfigSchema.index({ collegeId: 1, 'metadata.lastUpdated': -1 });


const LandingPageConfig = mongoose.model('LandingPageConfig', landingPageConfigSchema);

export default LandingPageConfig;