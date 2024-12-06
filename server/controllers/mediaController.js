import { Media } from '../models/index.js';

export const getMedia = async (req, res) => {
  try {
    const { type, id } = req.params;

    if (!['audio', 'video'].includes(type))
      return res.status(400).json({ message: 'Invalid media type' });

    const media = await Media.findOne({ _id: id, type: type });

    if (!media) return res.status(404).json({ message: 'Media not found' });

    res.set(
      'Content-Type',
      media.type === 'audio' ? 'audio/mpeg' : 'video/mp4'
    );
    res.send(media.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
