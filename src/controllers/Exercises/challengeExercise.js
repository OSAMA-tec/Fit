const Exercise = require('../../models/Exercise');
const Type1Challenge = require('../../models/Type1');
const Type2Challenge = require('../../models/Type2');
const UserStatus = require('../../models/Type2Status');

const createType1AndType2Challenges = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: 'User information is missing.' });
    }
    await Type1Challenge.deleteMany();
    await Type2Challenge.deleteMany();

    const unpaidExercises = await Exercise.find({ paid: false }).lean();
    const paidExercises = await Exercise.find({ paid: true }).lean();

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

    const type1ExerciseSchedule = Array.from({ length: 14 }, (_, index) => ({
      dayNumber: index + 1,
      exercises: shuffledUnpaidExercises.slice(index * 7, (index + 1) * 7).map(exercise => ({
        exerciseId: exercise._id,
        reps: 3,
        sets: 15
      }))
    }));
    type1ExerciseSchedule.forEach((daySchedule, index) => {
      console.log(`Day ${index + 1} exercises:`, daySchedule.exercises);
    });
    const type1Challenge = new Type1Challenge({
      startDate,
      endDate,
      exerciseSchedule: type1ExerciseSchedule
    });

    await type1Challenge.save();

    const type2ExerciseSchedule = Array.from({ length: 14 }, (_, index) => ({
      dayNumber: index + 1,
      exercises: [{
        exerciseId: shuffledPaidExercises[index]._id,
        reps: 3,
        sets: 15
      }]
    }));

    const type2Challenge = new Type2Challenge({
      startDate,
      endDate,
      exerciseSchedule: type2ExerciseSchedule
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





const joinCommunityController = async (req, res) => {
  try {
    const { type, typeid } = req.body;
    const userId = req.user.id;

    if (!type || !typeid) {
      return res.status(400).json({ message: 'Type and typeid are required.' });
    }

    if (type === 1) {
      const type1Challenge = await Type1Challenge.findById(typeid);

      if (!type1Challenge) {
        return res.status(404).json({ message: 'Type 1 Challenge not found.' });
      }

      if (!type1Challenge.userId.includes(userId)) {
        type1Challenge.userId.push(userId);
        await type1Challenge.save();
      }

      res.status(200).json({ message: 'Successfully joined Type 1 Challenge.' });

    } else if (type === 2) {
      const type2Challenge = await Type2Challenge.findById(typeid);

      if (!type2Challenge) {
        return res.status(404).json({ message: 'Type 2 Challenge not found.' });
      }

      const dailyStatus = type2Challenge.exerciseSchedule.map((_, index) => ({
        dayNumber: index + 1,
        success: false,
        status: 'pending',
        proofType: '',
        proofURL: ''
      }));

      const userStatus = new UserStatus({
        userId: userId,
        challengeId: typeid,
        dailyStatus: dailyStatus,
        overallStatus: {
          challengeCompleted: false,
          pointsEarned: 0,
          penaltyPaid: false
        }
      });

      await userStatus.save();

      res.status(200).json({ message: 'Successfully joined Type 2 Challenge and status created.' });

    } else {
      return res.status(400).json({ message: 'Invalid type specified.' });
    }
  } catch (error) {
    console.error('Error joining community:', error);
    res.status(500).json({ message: 'Server error while attempting to join community.' });
  }
};



module.exports = { createType1AndType2Challenges,joinCommunityController };
