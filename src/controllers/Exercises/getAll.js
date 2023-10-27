
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

  let paid;
  if (plan.name === 'free') {
    paid = { $in: [false] };
  } else {
    paid = { $in: [true, false] };
  }

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
    const level = req.query.level;
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
  if (!req.user || !req.query.bodyPart) {
    return res.status(400).json({ message: 'Bad Request: User or body part missing' });
  }
  try {
    const userId = req.user.id;
    const bodyPart = req.query.bodyPart;

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
    const dayOfWeek = req.query.dayOfWeek;
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

    const level = req.query.level || user.fitnessLevel;
    const bodyPart = req.query.bodyPart;
    const dayOfWeek = req.query.dayOfWeek;

    const exercises = await getExercisesWithPaidStatus(userId, { level, bodyPart, dayOfWeek });
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

    const exercises = Object.values(exercisesObj).flat();

    if (exercises.length === 0) {
      return res.status(404).json({ message: 'No exercises found' });
    }
    
    const randomExercises = [];
    for(let i=0;i<5;i++){
      if (exercises.length === 0) {
        break;
      }
      const randomIndex = Math.floor(Math.random() * exercises.length);
      const randomExercise = exercises[randomIndex];
      randomExercises.push(randomExercise);

      exercises.splice(randomIndex, 1);
    }
    
    res.status(200).json(randomExercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getExerciseId = async (req, res) => {
  try {
    const Id = req.query.id; 


    const exercise = await Exercise.findById(Id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.status(200).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const getPaidExercises = async (req, res) => {
try {
  const exercises = await Exercise.find({ paid: true });

  if (!exercises || exercises.length === 0) {
    return res.status(404).json({ message: 'No paid exercises found' });
  }

  const shuffledExercises = shuffleArray(exercises);

  res.status(200).json(shuffledExercises.slice(0, 100));
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
  getExerciseById,
  getExerciseId,
  getPaidExercises
};
