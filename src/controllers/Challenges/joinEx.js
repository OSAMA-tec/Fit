const User = require('../../models/User');
const Type1Challenge = require('../../models/Type1');
const Type2Challenge = require('../../models/Type2');
const UserStatus = require('../../models/Type2Status');

// Controller function to join a challenge
const joinChallenge = async (req, res) => {
  const userId = req.user.id;
  const { challengeType, typeId } = req.body;

  try {
    // Fetch the user and their plan
    const user = await User.findById(userId).populate('plan');

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(challengeType)
    // Join Type1 Challenge
    if (challengeType === 'Type1') {
      await Type1Challenge.findByIdAndUpdate(
        typeId,
        { $push: { userId: userId } },
        { new: true, upsert: true }
      );
      return res.status(200).json({ message: 'Successfully joined the Type1 Challenge' });
    }

    if (challengeType === 'Type2') {
      if (!user.plan || !(["premium", "elite"].includes(user.plan.name.toLowerCase()))) {
        return res.status(403).json({ message: 'You are not eligible. You need to have an elite or premium plan to join this challenge.' });
      }

      // Create UserStatus for Type2 Challenge
      const newUserStatus = new UserStatus({
        userId: userId,
        challengeId: typeId,
        dailyStatus: Array.from({ length: 14 }, (_, index) => ({
          day: index + 1,
          success: false,
          proofType: '',
          proofURL: ''
        })),
        overallStatus: {
          challengeCompleted: false,
          pointsEarned: 0,
          penaltyPaid: false
        }
      });

      await newUserStatus.save();
      return res.status(200).json({ message: 'Successfully joined the Type2 Challenge' });
    }

    return res.status(400).json({ message: 'Invalid challenge type' });

  } catch (error) {
    return res.status(500).json({ message: 'Failed to join challenge', error: error.message });
  }
};



const getJoinedChallenge = async (req, res) => {
  const userId = req.user.id;
  const { challengeType, typeId } = req.query;
  try {
    if (challengeType === 'Type1') {
      const challenge = await Type1Challenge.findById(typeId).populate('dailyExercises.exercises.exerciseId');
      if (challenge && challenge.userId.includes(userId)) {
        return res.status(200).json({
          challengeType: 'Type1',
          challengeDetails: challenge
        });
      }
    } else if (challengeType === 'Type2') {
      // Fetch the Type2Challenge
      const challenge = await Type2Challenge.findById(typeId).populate('dailyExercises.exercises.exerciseId');

      // Fetch the UserStatus for the user and this challenge
      const userStatus = await UserStatus.findOne({ userId: userId, challengeId: typeId });

      if (challenge && userStatus) {
        let allDaysSuccess = true;

        challenge.dailyExercises.forEach(day => {
          const dailyStatus = userStatus.dailyStatus.find(status => status.day === day.day);

          if (dailyStatus) {
            day.exercises.forEach(exercise => {
              exercise._doc.completed = dailyStatus.success;
            });

            if (!dailyStatus.success) {
              allDaysSuccess = false;
            }

          } else {
            day.exercises.forEach(exercise => {
              exercise._doc.completed = false;
            });
            allDaysSuccess = false; 
          }
        });

        if (allDaysSuccess) {
          await User.findByIdAndUpdate(userId, { $inc: { points: 200 } });
        }

        return res.status(200).json({
          challengeType: 'Type2',
          challengeDetails: challenge,
        });
      }
    }

    return res.status(404).json({ message: "You haven't joined any challenge." });

  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving challenge information',
      error: error.message
    });
  }
};




module.exports = {
  joinChallenge,
  getJoinedChallenge
};
