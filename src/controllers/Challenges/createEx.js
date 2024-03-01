const Exercise = require('../../models/Exercise');
const Type1Challenge = require('../../models/Type1');
const Type2Challenge = require('../../models/Type2');
const UserStatus = require('../../models/Type2Status');
const axios = require('axios'); 

// Controller function to save exercise to challenge
const saveExerciseToChallenge = async (req, res) => {
  try {
    // Clear previous challenges for the user
    await Type1Challenge.deleteMany();
    await Type2Challenge.deleteMany();
    await UserStatus.deleteMany();

    // Define start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (13 * 24 * 60 * 60 * 1000)); 



    const defaultSets = 3;
    const defaultReps = 12;

    // Fetch unpaid exercises for Type1Challenge
    const unpaidExercises = await Exercise.aggregate([
      { $match: { paid: false } },
      { $sample: { size: 98 } } // Fetch 98 unpaid exercises
    ]);

    // Fetch paid exercises for Type2Challenge
    const paidExercises = await Exercise.aggregate([
      { $match: { paid: true } },
      { $sample: { size: 98 } } // Fetch 98 paid exercises
    ]);

    // Split the exercises into 14 arrays of 7 exercises each for both challenges
    const dailyUnpaidExercisesChunks = chunkArray(unpaidExercises, 7);
    const dailyPaidExercisesChunks = chunkArray(paidExercises, 7);

    // Create daily exercises structure for Type1Challenge
    const dailyExercisesType1 = dailyUnpaidExercisesChunks.map((exercisesChunk, index) => ({
      day: index + 1,
      exercises: exercisesChunk.map(ex => ({
        exerciseId: ex._id,
        sets: defaultSets,
        reps: defaultReps,
        completed: false
      }))
    }));

    // Create exercise schedule structure for Type2Challenge
    const exerciseScheduleType2 = dailyPaidExercisesChunks.map((exercisesChunk, index) => ({
      day: index + 1,
      exercises: exercisesChunk.map(ex => ({
        exerciseIds: [ex._id],
        sets: defaultSets,
        reps: defaultReps
      }))
    }));

    // Save to Type1Challenge with unpaid exercises
    const type1Challenge = new Type1Challenge({
      startDate,
      endDate,
      dailyExercises: dailyExercisesType1,
    });
    await type1Challenge.save();

    // Save to Type2Challenge with paid exercises
    const type2Challenge = new Type2Challenge({
      requiredPoints: 50,
      startDate,
      endDate,
      dailyExercises: exerciseScheduleType2
    });
    await type2Challenge.save();

    res.status(201).json({
      message: 'Challenges created successfully',
      type1ChallengeId: type1Challenge._id,
      type2ChallengeId: type2Challenge._id
    });
  } catch (error) {
    res.status(500).json({ message: `Error saving exercises to challenges: ${error.message}` });
  }
};

function chunkArray(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}




const getChallenges = async (req, res) => {
  try {
    const today = new Date(); 
    const type1Challenges = await Type1Challenge.find().select('startDate endDate _id');
    const type2Challenges = await Type2Challenge.find().select('startDate endDate _id');

    const formattedChallenges = [
      ...type1Challenges.map(challenge => ({
        typeTitle: '14 Days Challenge',
        type: 'For ALL Users',
        typeChallenges: 'Type1',
        typeId: challenge._id,
        startDate: challenge.startDate,
        endDate: challenge.endDate
      })),
      ...type2Challenges.map(challenge => ({
        typeTitle: '14 Days Challenge',
        type: 'For Premium and Elite Users',
        typeChallenges: 'Type2',
        typeId: challenge._id,
        startDate: challenge.startDate,
        endDate: challenge.endDate
      }))
    ];

    const hasEndedChallenges = formattedChallenges.some(challenge => new Date(challenge.endDate) < today);

    if (hasEndedChallenges) {
      await axios.post('https://fitnessapp-666y.onrender.com/api/challenge', {
        message: 'A challenge has ended.'
      });
    }

    return res.status(200).json({
      success: true,
      challenges: formattedChallenges
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve challenges',
      error: error.message
    });
  }
};




module.exports = {
  saveExerciseToChallenge,
  getChallenges
};
