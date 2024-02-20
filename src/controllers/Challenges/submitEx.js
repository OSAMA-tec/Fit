const User = require('../../models/User');
const Type1Challenge = require('../../models/Type1');
const Type2Challenge = require('../../models/Type2');
const UserStatus = require('../../models/Type2Status');
const uploadMediaToFirebase = require('../../firebase/firebaseImage');
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

            // If old is true, set penaltyPaid to true
            if (old) {
                updateObject.$set['overallStatus.penaltyPaid'] = true;
            }

            await UserStatus.updateOne(
                { userId: userId, challengeId: typeId },
                updateObject,
                { arrayFilters: [{ 'elem.dayNumber': dayNumber }] }
            );

            return res.status(200).json({ message: 'Type2 challenge updated successfully', mediaUrl });
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

module.exports = {
    markChallengeAsCompleted,
};