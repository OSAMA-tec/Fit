const Exercise = require('../../models/Exercise'); 
const Type1Challenge = require('../../models/Type1'); 
const Type2Challenge = require('../../models/Type2'); 

const createType1AndType2Challenges = async (req, res) => {
  try {
    const unpaidExercises = await Exercise.find({ paid: false }).lean();
    const paidExercises = await Exercise.find({ paid: true }).lean();

    const shuffledUnpaidExercises = unpaidExercises.sort(() => 0.5 - Math.random());
    const shuffledPaidExercises = paidExercises.sort(() => 0.5 - Math.random());

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 14);

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

    // Create Type 2 Challenge with a unique paid exercise for each day
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
    res.status(500).json({ message: 'Error creating challenges', error });
  }
};


module.exports={createType1AndType2Challenges}