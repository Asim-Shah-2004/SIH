import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import logger from './utils/logger.js';

import {connectMongoDB} from "./services/index.js"
import {eventRouter} from "./routers/index.js"

const app = express();
const PORT = 3000;

connectMongoDB();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/events', eventRouter);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});