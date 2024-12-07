import express from 'express';
import { getMedia, putMedia } from '../controllers/mediaController.js';

const mediaGetRouter = express.Router();
const mediaUploadRouter = express.Router();

mediaGetRouter.get('/:type/:id', getMedia);
mediaUploadRouter.post('/upload', putMedia);

export { mediaGetRouter, mediaUploadRouter };
