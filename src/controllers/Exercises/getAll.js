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

module.exports={getAllExercises,getExercisesByLevel}