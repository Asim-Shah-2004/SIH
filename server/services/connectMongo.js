import mongoose from 'mongoose';
import 'dotenv/config';

import logger from '../utils/logger.js';

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('connected to database successfully');
  } catch (err) {
    logger.error(err);
  }
};

export default connectMongoDB;
