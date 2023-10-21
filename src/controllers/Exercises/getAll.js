
const Exercise = require('../../models/Exercise');
const User = require('../../models/User');

const getExercisesWithPaidStatus = async (userId, query) => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  if (user.role === 'admin') {
    return await Exercise.find(query);
  }
  console.log(user.role)
  const hasPlan = user.plan != null;
  console.log(hasPlan)
  const paid = hasPlan ? { $in: [true, false] } : false;
  console.log(paid)

  return await Exercise.find({ ...query, paid });
};

const getAllExercises = async (req, res) => {
  try {
    const userId = req.user.id;
    const exercises = await getExercisesWithPaidStatus(userId, {});
    if (!exercises) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getExercisesByLevel = async (req, res) => {
  try {
    const userId = req.user.id;
    const level = req.body.level;
    if (!level) {
      return res.status(404).json({ message: "level not passed" });
    }
    const exercises = await getExercisesWithPaidStatus(userId, { level });
    if (!exercises) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExercisesByBodyPart = async (req, res) => {
  try {
    const userId = req.user.id;
    const bodyPart = req.body.bodyPart;
    const exercises = await getExercisesWithPaidStatus(userId, { bodyPart });
    if (!exercises) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExercisesByDayOfWeek = async (req, res) => {
  try {
    const userId = req.user.id;
    const dayOfWeek = req.body.dayOfWeek;
    const exercises = await getExercisesWithPaidStatus(userId, { dayOfWeek });
    if (!exercises) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExercises = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const level = user.fitnessLevel;
    const bodyPart = req.body.bodyPart;
    const dayOfWeek = req.body.dayOfWeek;

    const exercises = await getExercisesWithPaidStatus(userId, { level, bodyPart, dayOfWeek });
    console.log(exercises)
    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ message: 'No exercises found for the given criteria' });
    }

    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllExercises,
  getExercisesByLevel,
  getExercisesByBodyPart,
  getExercisesByDayOfWeek,
  getExercises
};