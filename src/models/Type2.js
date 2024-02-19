const mongoose = require('mongoose');


const ExerciseEntrySchema = new mongoose.Schema({
    exerciseIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
    }],
    reps: {
        type: Number,
    },
    sets: {
        type: Number,
    }
});
const DaySchemaType2 = new mongoose.Schema({
    dayNumber: {
        type: Number,
    },
    exercises: [ExerciseEntrySchema],
    submissionStatus: {
        success: {
            type: Boolean,
            default: false
        },
        proofType: String,
        proofURL: String
    }
});

const Type2ChallengeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    requiredPoints: {
        type: Number,
        default: 50
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    exerciseSchedule: [DaySchemaType2],
    completionStatus: {
        challengeCompleted: {
            type: Boolean,
            default: false
        },
        pointsEarned: {
            type: Number,
            default: 0
        },
        penaltyPaid: {
            type: Boolean,
            default: false
        }
    }
});

module.exports = mongoose.model('Type2Challenge', Type2ChallengeSchema);
