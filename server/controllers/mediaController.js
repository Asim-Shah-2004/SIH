import { Media } from '../models/index.js';

export const getMedia = async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['image', 'audio', 'video', 'document'].includes(type)) {
      return res.status(400).json({ message: 'Invalid media type' });
    }

    const media = await Media.findOne({ _id: id, type: type });
    if (!media) return res.status(404).json({ message: 'Media not found' });

    const contentTypes = {
      image: 'image/jpeg',
      audio: 'audio/mpeg',
      video: 'video/mp4',
      document: media.mimeType || 'application/octet-stream',
    };

    const buffer = media.buffer.startsWith('data:')
      ? Buffer.from(media.buffer.split(',')[1], 'base64')
      : Buffer.from(media.buffer, 'base64');

    res.set('Content-Type', contentTypes[type]);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const putMedia = async (req, res) => {
  try {
    const { type, buffer, mimeType } = req.body;

    if (!['image', 'audio', 'video', 'document'].includes(type)) {
      return res.status(400).json({ message: 'Invalid media type' });
    }

    // Handle base64 data with or without data URI scheme
    const base64Data = buffer.startsWith('data:')
      ? buffer
      : `data:${mimeType};base64,${buffer}`;

    const media = new Media({
      type,
      buffer: base64Data,
      mimeType: mimeType || null,
    });

    await media.save();

    res.status(201).json({
      message: 'Media created successfully',
      id: media._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
