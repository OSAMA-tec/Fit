const Exercise = require('../../models/Exercise');
const Type1Challenge = require('../../models/Type1');
const Type2Challenge = require('../../models/Type2');

const createType1AndType2Challenges = async (req, res) => {
  try {
    // Ensure the user is provided in the request
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User information is missing.' });
    }

    const unpaidExercises = await Exercise.find({ paid: false }).lean();
    const paidExercises = await Exercise.find({ paid: true }).lean();

    // Check if there are enough exercises to create the challenges
    if (unpaidExercises.length < 14 * 7) {
      return res.status(400).json({ message: 'Not enough unpaid exercises to create Type 1 Challenge.' });
    }
    if (paidExercises.length < 14) {
      return res.status(400).json({ message: 'Not enough paid exercises to create Type 2 Challenge.' });
    }

    const shuffledUnpaidExercises = unpaidExercises.sort(() => 0.5 - Math.random());
    const shuffledPaidExercises = paidExercises.sort(() => 0.5 - Math.random());

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (14 * 24 * 60 * 60 * 1000));

    // Create Type 1 Challenge
    const type1ExerciseSchedule = Array.from({ length: 14 }, (_, index) => ({
      dayNumber: index + 1,
      exercises: shuffledUnpaidExercises.slice(index * 7, (index + 1) * 7).map(exercise => ({
        exerciseId: exercise._id,
        reps: 3,
        sets: 15
      }))
    }));

    const type1Challenge = new Type1Challenge({
      userId: req.user._id,
      startDate,
      endDate,
      exerciseSchedule: type1ExerciseSchedule
    });

    await type1Challenge.save();

    // Create Type 2 Challenge
    const type2ExerciseSchedule = Array.from({ length: 14 }, (_, index) => ({
      dayNumber: index + 1,
      exercises: [{
        exerciseId: shuffledPaidExercises[index]._id,
        reps: 3,
        sets: 15
      }],
      submissionStatus: {
        success: false,
        proofType: '',
        proofURL: ''
      }
    }));

    const type2Challenge = new Type2Challenge({
      userId: req.user._id,
      startDate,
      endDate,
      exerciseSchedule: type2ExerciseSchedule,
      completionStatus: {
        challengeCompleted: false,
        pointsEarned: 0,
        penaltyPaid: false
      }
    });

    await type2Challenge.save();

    res.status(201).json({
      message: 'Challenges created successfully',
      type1ChallengeId: type1Challenge._id,
      type2ChallengeId: type2Challenge._id
    });

  } catch (error) {
    console.error('Error creating challenges:', error);
    
    // Determine the status code based on the error
    const statusCode = error.name === 'ValidationError' ? 400 : 500;

    res.status(statusCode).json({
      message: error.message || 'An unexpected error occurred while creating challenges.'
    });
  }
};

module.exports = { createType1AndType2Challenges };
