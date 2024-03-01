const User = require('../../models/User');
const Type1Challenge = require('../../models/Type1');
const Type2Challenge = require('../../models/Type2');
const UserStatus = require('../../models/Type2Status');
const uploadMediaToFirebase = require('../../firebase/firebaseImage');
const mongoose = require('mongoose');

const fs = require('fs')
// Controller function to mark challenge as completed
const markChallengeAsCompleted = async (req, res) => {
    const { challengeType, typeId, dayNumber, completed,old } = req.body;
    const userId = req.user.id;
    const file=req.file
    
    try {
        if (challengeType === 'Type1') {
            // Update for Type1Challenge
            await Type1Challenge.updateOne(
                { _id: typeId, 'userId': userId },
                { $set: { 'dailyExercises.$[dayElem].exercises.$[exerciseElem].completed': completed } },
                {
                    arrayFilters: [
                        { 'dayElem.day': dayNumber },
                        { 'exerciseElem.completed': { $ne: true } }
                    ]
                }
            );
            return res.status(200).json({ message: 'Type1 challenge updated successfully' });
        } else if (challengeType === 'Type2') {
            if (!file) {
                return res.status(400).json({ message: 'Type2 challenge requires a picture or video.' });
            }
            
            // Convert the uploaded file buffer to Base64
            const base64Media = file.buffer.toString('base64');
            const contentType = file.mimetype;

            // Upload to Firebase
            const mediaUrl = await uploadMediaToFirebase(`challengeMedia/${userId}_${Date.now()}`, base64Media, contentType);

            // Define the update object
            let updateObject = {
                $set: {
                    'dailyStatus.$[elem].success': completed,
                    'dailyStatus.$[elem].proofURL': mediaUrl,
                    'dailyStatus.$[elem].proofType': contentType.includes('video') ? 'video' : 'image'
                },
                $inc: { 'overallStatus.pointsEarned': completed ? 20 : 0 }
            };
            await User.findByIdAndUpdate(userId, { $inc: { points: 20 } });
            // If old is true, set penaltyPaid to true
            if (old) {
                updateObject.$set['overallStatus.penaltyPaid'] = true;
            }
            console.log(userId)
            console.log(typeId)
            const userStatus = await UserStatus.findOne({
              userId: userId,
              challengeId:typeId, 
          });
            await UserStatus.updateOne(
                { userId: userId, challengeId: typeId },
                updateObject,
                { arrayFilters: [{ 'elem.dayNumber': dayNumber }] }
            );
            
            return res.status(200).json({ message: 'Type2 challenge updated successfully', mediaUrl,userStatus });
        } else {
            return res.status(400).json({ message: 'Invalid challenge type' });
        }
    } catch (error) {
        console.error('Error updating challenge status:', error);
        return res.status(500).json({
            message: 'Error updating challenge status',
            error: error.message
        });
    }
};
const updateExerciseStatus = async (req, res) => {
    try {
      const { challengeType, typeId, dayNumber, exerciseId } = req.body;
      const userId = req.user.id;
  
      let challengeModel;
      let challengeFieldName;
      let dayFieldName;
      let challengeId;
  
      switch (challengeType) {
        case 'Type1':
          challengeModel = Type1Challenge;
          challengeFieldName = 'dailyExercises';
          dayFieldName = 'day';
          break;
        case 'Type2':
          // First find the challengeId from type2status
          const type2status = await UserStatus.findOne({ userId: new mongoose.Types.ObjectId(userId) });
          if (!type2status) {
            return res.status(404).json({ message: 'Type2Status for user not found' });
          }
          challengeId = type2status.challengeId;
          challengeModel = Type2Challenge;
          challengeFieldName = 'exerciseSchedule';
          dayFieldName = 'dayNumber';
          break;
        default:
          return res.status(400).json({ message: 'Invalid challenge type' });
      }
  
      // Find the challenge by typeId (and challengeId for Type2)
      const challengeQuery = { _id: typeId };
      if (challengeType === 'Type1') {
        challengeQuery.userId = { $in: [new mongoose.Types.ObjectId(userId)] };
      } else if (challengeType === 'Type2') {
        challengeQuery._id = challengeId; 
      }
  
      const challenge = await challengeModel.findOne(challengeQuery);
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found or user not associated with it' });
      }
  
      // Update the eachExercise field for the matching exercise
      let exerciseUpdated = false;
      challenge[challengeFieldName].forEach(day => {
        if (day[dayFieldName] === dayNumber) {
          day.exercises.forEach(exerciseEntry => {
            const exerciseIds = exerciseEntry.exerciseIds || [exerciseEntry.exerciseId];
            if (exerciseIds.some(exId => exId.equals(new mongoose.Types.ObjectId(exerciseId)))) {
              exerciseEntry.eachExercise = true;
              exerciseUpdated = true;
            }
          });
        }
      });
  
      if (!exerciseUpdated) {
        return res.status(404).json({ message: 'Exercise on the given day not found' });
      }
  
      await challenge.save();
      res.status(200).json({ message: 'Exercise status updated successfully' });
  
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  


module.exports = {
    markChallengeAsCompleted,
    updateExerciseStatus
};