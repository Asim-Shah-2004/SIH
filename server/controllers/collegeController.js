import { College, User } from '../models/index.js';

export const getCollege = async (req, res) => {
  try {
    const { college_id } = req.params;
    const college = await College.findById(college_id);
    if (!college) return res.status(404).json({ message: 'College not found' });
    res.status(200).json(college);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCollege = async (req, res) => {
  try {
    const { college_id } = req.params;

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

    const college = await College.findByIdAndUpdate(college_id, { $set: updates });

    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.json({
      message: 'College updated successfully',
      collegeData,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const { college_id } = req.params;

    const users = await User.find();

    const departments = new Set();
    users.forEach((user) => {
      user.education
        .filter((edu) => edu.college_id.toString() === college_id)
        .forEach((edu) => departments.add(edu.department));
    });

    res.status(200).json(Array.from(departments));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};
