const mongoose = require('mongoose');


const ExerciseEntrySchema = new mongoose.Schema({
    exerciseIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    }],
    reps: {
        type: Number,
        required: true
    },
    sets: {
        type: Number,
        required: true
    }
});
const DaySchemaType2 = new mongoose.Schema({
    dayNumber: {
        type: Number,
        required: true
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
        required: true
    },
    requiredPoints: {
        type: Number,
        default: 50
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
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
