// controllers/exerciseController.js

const Exercise = require('../../models/Exercise');
const User = require('../../models/User');

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

    const exercises = await Exercise.find({ level, bodyPart, dayOfWeek });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ message: 'No exercises found for the given criteria' });
    }

    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getExercisesByLevel = async (req, res) => {
  try {
    const level = req.body.level;
    console.log(level)
    if(!level)
    {
      res.status(404).json({ message: "level not passed "});
    }
    const exercises = await Exercise.find({ level: level });
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getExercisesByBodyPart = async (req, res) => {
  try {
    const bodyPart = req.body.bodyPart;
    const exercises = await Exercise.find({ bodyPart: bodyPart });
    if (!exercises) {
      return res.status(404).json({ message: 'No exercises found for this body part' });
    }
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getExercisesByDayOfWeek = async (req, res) => {
  try {
    const dayOfWeek = req.body.dayOfWeek;
    const exercises = await Exercise.find({ dayOfWeek: dayOfWeek });
    if (!exercises) {
      return res.status(404).json({ message: 'No exercises found for this day of the week' });
    }
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports={getAllExercises,getExercisesByLevel,getExercisesByBodyPart,getExercisesByDayOfWeek,getExercises};

