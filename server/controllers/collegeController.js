import { College } from '../models/index.js';

const updateCollege = async (req, res) => {
  try {

    const allowedUpdates = [
      'email',
      'logo',
      'address',
      'website',
      'contactNumber',
      'accreditation',
      'ranking',
      'establishedYear',
      'coursesOffered',
      'missionStatement',
      'visionStatement',
      'tagline',
      'banners',
    ];

    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: 'No valid update fields provided' });
    }

    const college = await College.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      {
        new: true, 
        runValidators: true,
        select: '-password -registeredAlumni', 
      }
    );

    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.json({
      message: 'College updated successfully',
      college,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { updateCollege };
