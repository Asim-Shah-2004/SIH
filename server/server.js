import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import logger from './utils/logger.js';
import cors from 'cors';

import {connectMongoDB} from "./services/index.js"
import {eventRouter,jobRouter,donationRouter} from "./routers/index.js"

const app = express();
const PORT = 3000;

connectMongoDB();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
}));

app.use('/events', eventRouter);
app.use('/jobs', jobRouter);
app.use('/donations', donationRouter);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});