// exerciseController.js

const Exercise = require('../../models/Exercise');

const getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();
    res.status(200).json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={getAllExercises}