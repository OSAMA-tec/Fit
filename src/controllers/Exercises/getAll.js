
const Exercise = require('../../models/Exercise');
const User = require('../../models/User');
const Plan = require('../../models/Plan');

const getExercisesWithPaidStatus = async (userId, query) => {
  const user = await User.findById(userId);
  if (!user) {
    return null;
  }

  if (user.role === 'admin') {
    return await Exercise.find(query);
  }

  const hasPlan = user.plan != null;
  if (!hasPlan) {
    return { message: 'No plan activated', exercises: [] };
  }

  const plan = await Plan.findById(user.plan);
  const startDate = plan.startDate;
  const durationInDays = plan.durationInDays;
  const endDate = startDate.setDate(startDate.getDate() + durationInDays);
  const currentDate = new Date();
  const remainingDays = Math.ceil((endDate - currentDate) / (1000 * 60 * 60 * 24));

  const paid = { $in: [true, false] };

  const exercises = await Exercise.find({ ...query, paid });

  return { message: `Subscription period left: ${remainingDays} days`, exercises };
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

const getExerciseById = async (req, res) => {
  try {
    const userId = req.user.id;

    const exercisesObj = await getExercisesWithPaidStatus(userId);

    if (typeof exercisesObj !== 'object') {
      return res.status(500).json({ message: 'Exercises is not an object' });
    }

    const exercises = Object.values(exercisesObj);

    if (exercises.length === 0) {
      return res.status(404).json({ message: 'No exercises found' });
    }

    const randomIndex = Math.floor(Math.random() * exercises[1].length);
    console.log(randomIndex)
    const randomExercise = exercises[1][randomIndex];

    res.status(200).json(randomExercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllExercises,
  getExercisesByLevel,
  getExercisesByBodyPart,
  getExercisesByDayOfWeek,
  getExercises,
  getExerciseById
};
