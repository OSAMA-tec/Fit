const User = require('../../models/User');
const Plan = require('../../models/Plan');
const Exercise = require('../../models/Exercise');

const getType1OrType2Exercises = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('plan');
    if (!user || !user.plan) {
      return res.status(404).json({ message: 'Plan not found for this user.' });
    }

    const plan = await Plan.findById(user.plan._id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found.' });
    }

    let exerciseType;
    if (plan.name === 'premium' || plan.name === 'elite') {
      exerciseType = 'Type 2';
    } else if (plan.name === 'free') {
      exerciseType = 'Type 1';
    } else {
      return res.status(400).json({ message: 'Invalid plan type.' });
    }

    const paidStatus = exerciseType === 'Type 2';
    const exercises = await Exercise.find({ paid: paidStatus });

    const shuffledExercises = exercises.sort(() => 0.5 - Math.random());

    const response = {
      exerciseType,
      exercises: [],
      status: []
    };

    for (let day = 1; day <= 14; day++) {
      const dayExercises = shuffledExercises.slice((day - 1) * 7, day * 7);
      response.exercises.push({
        day,
        exerciseDetails: dayExercises
      });

      if (exerciseType === 'Type 2') {
        response.status.push({
          day,
          completed: false,
          pointsEarned: 0
        });
      }
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while retrieving exercises.' });
  }
};

module.exports = { getType1OrType2Exercises };
