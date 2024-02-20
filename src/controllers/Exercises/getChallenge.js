const User = require('../../models/User');
const Plan = require('../../models/Plan');
const Exercise = require('../../models/Exercise');
const Type1Challenge = require('../../models/Type1');
const Type2Challenge = require('../../models/Type2');
const UserStatus = require('../../models/Type2Status');
const getType1OrType2Exercises = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('plan');
    if (!user || !user.plan) {
      return res.status(404).json({ message: 'Plan not found for this user.', joined: false });
    }

    let exerciseType;
    let joined = false;
    let exerciseSchedule = [];

    if (user.plan.name === 'premium' || user.plan.name === 'elite') {
      exerciseType = 'Type 2';
      const userStatus = await UserStatus.findOne({ userId: req.user.id });
      if (userStatus) {
        const challenge = await Type2Challenge.findById(userStatus.challengeId).populate({
          path: 'exerciseSchedule.exercises.exerciseIds',
          model: 'Exercise'
        });
        joined = !!challenge;
        if (joined) {
          exerciseSchedule = challenge.exerciseSchedule;
        }
      }
    } else if (user.plan.name === 'free') {
      exerciseType = 'Type 1';
      const type1Challenge = await Type1Challenge.findOne({ userId: req.user.id }).populate({
        path: 'exerciseSchedule.exercises.exerciseIds',
        model: 'Exercise'
      });
      joined = !!type1Challenge;
      if (joined) {
        exerciseSchedule = type1Challenge.exerciseSchedule;
        console.log('Type 1 Exercise Schedule:', exerciseSchedule);
      }
    } else {
      return res.status(400).json({ message: 'Invalid plan type.', joined: false });
    }

    const transformedExerciseSchedule = exerciseSchedule.map(day => ({
      dayNumber: day.dayNumber,
      exercises: day.exercises.map(exEntry => {
        console.log('Exercise Entry:', exEntry); 
        return {
          exerciseId: exEntry._id, 
          name: exEntry.name, 
          reps: exEntry.reps,
          sets: exEntry.sets
        };
      })
    }));

    res.json({
      exerciseType,
      joined,
      exerciseSchedule: transformedExerciseSchedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while retrieving exercises.', joined: false });
  }
};

module.exports = { getType1OrType2Exercises };
